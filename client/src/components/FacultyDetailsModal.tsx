import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminAPI, hodAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface FacultyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  facultyId: string | null;
  facultyName?: string;
}

export function FacultyDetailsModal({
  isOpen,
  onClose,
  facultyId,
  facultyName,
}: FacultyDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    fdpAttended: any[];
    fdpOrganized: any[];
    seminars: any[];
    abl: any[];
    jointTeaching: any[];
    adjunct: any[];
    achievements: any[];
    internships: any[];
    reimbursements: any[];
  }>({
    fdpAttended: [],
    fdpOrganized: [],
    seminars: [],
    abl: [],
    jointTeaching: [],
    adjunct: [],
    achievements: [],
    internships: [],
    reimbursements: [],
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && facultyId) {
      loadData();
    }
  }, [isOpen, facultyId]);

  const loadData = async () => {
    if (!facultyId) return;
    setLoading(true);
    try {
      let fdpAttendedMsg = [], fdpOrganizedMsg = [], seminarsMsg = [], ablMsg = [], jointMsg = [], adjunctMsg = [], achievementsMsg = [], internshipsMsg = [], reimbursementsMsg = [];

      if (user?.role === 'hod') {
        // Use HOD API for available records
        const records = await hodAPI.getRecords();
        fdpAttendedMsg = records.fdpAttended;
        fdpOrganizedMsg = records.fdpOrganized;
        seminarsMsg = records.seminars;
        ablMsg = records.abl;
        jointMsg = records.jointTeaching;
        adjunctMsg = records.adjunct;

        // Try to fetch others via admin API, ignore errors if restricted
        const fetchSecurely = async (fn: () => Promise<any>) => {
          try { return await fn(); } catch (e) { console.warn('Fetch restricted:', e); return []; }
        };

        [achievementsMsg, internshipsMsg, reimbursementsMsg] = await Promise.all([
          fetchSecurely(adminAPI.getAchievements),
          fetchSecurely(adminAPI.getInternships),
          fetchSecurely(adminAPI.getReimbursements),
        ]);

      } else {
        // Admin logic
        [
          fdpAttendedMsg,
          fdpOrganizedMsg,
          seminarsMsg,
          ablMsg,
          jointMsg,
          adjunctMsg,
          achievementsMsg,
          internshipsMsg,
          reimbursementsMsg,
        ] = await Promise.all([
          adminAPI.getFDPAttended(),
          adminAPI.getFDPOrganized(),
          adminAPI.getSeminars(),
          adminAPI.getABL(),
          adminAPI.getJointTeaching(),
          adminAPI.getAdjunctFaculty(),
          adminAPI.getAchievements(),
          adminAPI.getInternships(),
          adminAPI.getReimbursements(),
        ]);
      }

      // Helper to filter by facultyId
      const filterByFaculty = (list: any[]) =>
        list.filter((item) => {
          const fId = item.facultyId?._id || item.facultyId;
          return fId === facultyId;
        });

      setData({
        fdpAttended: filterByFaculty(fdpAttendedMsg),
        fdpOrganized: filterByFaculty(fdpOrganizedMsg),
        seminars: filterByFaculty(seminarsMsg),
        abl: filterByFaculty(ablMsg),
        jointTeaching: filterByFaculty(jointMsg),
        adjunct: filterByFaculty(adjunctMsg),
        achievements: filterByFaculty(achievementsMsg),
        internships: filterByFaculty(internshipsMsg),
        reimbursements: filterByFaculty(reimbursementsMsg),
      });
    } catch (error) {
      console.error('Failed to load faculty details:', error);
    } finally {
      setLoading(false);
    }
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-8 text-muted-foreground">{message}</div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Faculty Details: {facultyName}</DialogTitle>
          <DialogDescription>
            View all records and contributions for this faculty member.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="fdp-attended" className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="w-full border-b">
              <TabsList className="mb-2 h-auto flex-wrap justify-start gap-2 bg-transparent p-2">
                <TabsTrigger value="fdp-attended">FDP Attended ({data.fdpAttended.length})</TabsTrigger>
                <TabsTrigger value="fdp-organized">FDP Organized ({data.fdpOrganized.length})</TabsTrigger>
                <TabsTrigger value="seminars">Seminars ({data.seminars.length})</TabsTrigger>
                <TabsTrigger value="abl">ABL ({data.abl.length})</TabsTrigger>
                <TabsTrigger value="joint">Joint Teaching ({data.jointTeaching.length})</TabsTrigger>
                <TabsTrigger value="adjunct">Adjunct ({data.adjunct.length})</TabsTrigger>
                <TabsTrigger value="achievements">Achievements ({data.achievements.length})</TabsTrigger>
                <TabsTrigger value="internships">Internships ({data.internships.length})</TabsTrigger>
                <TabsTrigger value="reimbursements">Reimbursements ({data.reimbursements.length})</TabsTrigger>
              </TabsList>
            </ScrollArea>

            <ScrollArea className="flex-1 p-4">
              <TabsContent value="fdp-attended" className="mt-0">
                {data.fdpAttended.length === 0 ? (
                  <EmptyState message="No FDPs attended found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.fdpAttended.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mode:</span>
                            <span className="capitalize">{item.mode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Venue:</span>
                            <span>{item.venue}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={item.status === 'approved' ? 'default' : item.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="fdp-organized" className="mt-0">
                {data.fdpOrganized.length === 0 ? (
                  <EmptyState message="No FDPs organized found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.fdpOrganized.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="capitalize">{item.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Venue:</span>
                            <span>{item.venue}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={item.status === 'approved' ? 'default' : item.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="seminars" className="mt-0">
                {data.seminars.length === 0 ? (
                  <EmptyState message="No seminars found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.seminars.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Topic:</span>
                            <span>{item.topic}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Venue:</span>
                            <span>{item.venue}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="abl" className="mt-0">
                {data.abl.length === 0 ? (
                  <EmptyState message="No ABL records found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.abl.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{item.subjectName}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Course Code:</span>
                            <span>{item.courseCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Industry Connect:</span>
                            <span>{item.industryConnect}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="joint" className="mt-0">
                {data.jointTeaching.length === 0 ? (
                  <EmptyState message="No joint teaching records found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.jointTeaching.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{item.courseName}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Course Code:</span>
                            <span>{item.courseCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Faculty Involved:</span>
                            <span>{item.facultyInvolved}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hours:</span>
                            <span>{item.hours}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="adjunct" className="mt-0">
                {data.adjunct.length === 0 ? (
                  <EmptyState message="No adjunct faculty records found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.adjunct.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{item.facultyName}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Department:</span>
                            <span>{item.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Course Code:</span>
                            <span>{item.courseCode}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="achievements" className="mt-0">
                {data.achievements.length === 0 ? (
                  <EmptyState message="No achievements found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.achievements.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="capitalize">{item.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={item.status === 'verified' ? 'default' : item.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="internships" className="mt-0">
                {data.internships.length === 0 ? (
                  <EmptyState message="No internships found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.internships.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{item.companyName}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Role:</span>
                            <span>{item.role}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{item.duration}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reimbursements" className="mt-0">
                {data.reimbursements.length === 0 ? (
                  <EmptyState message="No reimbursements found." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.reimbursements.map((item) => (
                      <Card key={item._id}>
                        <CardHeader className="pb-2">
                          {/* item.fdpId might be populated or just ID. Assuming populated based on API usage in other files */}
                          <CardTitle className="text-base font-semibold">
                            {typeof item.fdpId === 'object' ? item.fdpId.title : 'FDP Reimbursement'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount:</span>
                            <span>₹{item.amount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={item.status === 'approved' || item.status === 'processed' ? 'default' : item.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
