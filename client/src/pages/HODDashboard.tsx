import { useState, useEffect } from 'react';
import { Users, FileText, Award, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hodAPI } from '@/lib/api';

const HODDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFaculty: 0,
    pendingFDPs: 0,
    approvedFDPs: 0,
    totalSeminars: 0,
  });
  const [faculty, setFaculty] = useState<any[]>([]);
  const [recentFDPs, setRecentFDPs] = useState<any[]>([]);
  const [recentSeminars, setRecentSeminars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardData, facultyData, recordsData] = await Promise.all([
        hodAPI.getDashboard(),
        hodAPI.getFaculty(),
        hodAPI.getRecords(),
      ]);

      setFaculty(facultyData || []);

      // Get recent FDPs and Seminars from records
      const allFDPs = [...(recordsData.fdpAttended || []), ...(recordsData.fdpOrganized || [])];
      setRecentFDPs(allFDPs.slice(0, 3));
      setRecentSeminars((recordsData.seminars || []).slice(0, 3));

      // Calculate stats from records for accuracy
      const pendingCount = allFDPs.filter((f: any) => f.status === 'pending').length;
      const approvedCount = allFDPs.filter((f: any) => f.status === 'approved').length;

      setStats({
        totalFaculty: facultyData?.length || 0,
        pendingFDPs: pendingCount,
        approvedFDPs: approvedCount,
        totalSeminars: recordsData.seminars?.length || 0,
        // Store total count for display
        totalFDPsCount: allFDPs.length
      } as any);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">HOD Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of {user?.department} department
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Department Faculty"
            value={stats.totalFaculty}
            icon={Users}
            description="Active members"
          />
          <StatCard
            title="Total FDPs"
            value={(stats as any).totalFDPsCount || 0}
            icon={Award}
            description="Attended & Organized"
          />
          <StatCard
            title="Total Seminars"
            value={stats.totalSeminars}
            icon={FileText}
            description="This year"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingFDPs}
            icon={TrendingUp}
            description="FDPs requiring review"
            trend={stats.pendingFDPs > 0 ? '!' : undefined}
          />
        </div>
      )}

      {/* Faculty Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Department Faculty</CardTitle>
              <CardDescription>Faculty members in {user?.department}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/hod/faculty')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : faculty.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No faculty members found</div>
          ) : (
            <div className="space-y-4">
              {faculty.slice(0, 5).map((fac: any) => (
                <div
                  key={fac._id || fac.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                      {fac.name?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <p className="font-medium">{fac.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {fac.designation || 'Faculty'} • {fac.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{fac.department || user?.department}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent FDPs</CardTitle>
            <CardDescription>Latest FDP records from department</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : recentFDPs.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No FDP records</div>
            ) : (
              <div className="space-y-3">
                {recentFDPs.map((fdp: any) => (
                  <div key={fdp._id || fdp.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{fdp.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {fdp.facultyId?.name || fdp.venue || 'N/A'}
                      </p>
                    </div>
                    <Badge
                      variant={
                        fdp.status === 'approved'
                          ? 'default'
                          : fdp.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {fdp.status || 'pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Seminars</CardTitle>
            <CardDescription>Latest seminar records</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : recentSeminars.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No seminar records</div>
            ) : (
              <div className="space-y-3">
                {recentSeminars.map((seminar: any) => (
                  <div key={seminar._id || seminar.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{seminar.title}</p>
                      <p className="text-xs text-muted-foreground">{seminar.topic || 'Seminar'}</p>
                    </div>
                    <Badge variant="outline">
                      {seminar.date ? new Date(seminar.date).toLocaleDateString() : 'N/A'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HODDashboard;

