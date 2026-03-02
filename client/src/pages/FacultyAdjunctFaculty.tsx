import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdjunctFaculty } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { facultyAPI } from '@/lib/api';

const FacultyAdjunctFaculty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<AdjunctFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AdjunctFaculty | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await facultyAPI.getAdjunctFaculty();
      setRecords(data.map((item: any) => ({
        id: item._id || item.id,
        facultyId: item.facultyId?._id || item.facultyId || user?.id || '',
        facultyName: item.facultyName,
        department: item.department,
        courseCode: item.courseCode,
        supportingDocs: item.supportingDocs,
      })));
    } catch (error) {
      console.error('Failed to load records:', error);
      toast({ title: 'Failed to load records', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      facultyName: formData.get('facultyName') as string,
      department: formData.get('department') as string,
      courseCode: formData.get('courseCode') as string,
    };

    try {
      if (editingRecord) {
        await facultyAPI.updateAdjunctFaculty(editingRecord.id, data);
        toast({ title: 'Adjunct faculty updated successfully' });
      } else {
        await facultyAPI.createAdjunctFaculty(data);
        toast({ title: 'Adjunct faculty added successfully' });
      }
      await loadRecords();
      setIsDialogOpen(false);
      setEditingRecord(null);
    } catch (error) {
      console.error('Failed to save record:', error);
      toast({ title: 'Failed to save record', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await facultyAPI.deleteAdjunctFaculty(id);
      toast({ title: 'Record deleted successfully', variant: 'destructive' });
      await loadRecords();
    } catch (error) {
      console.error('Failed to delete record:', error);
      toast({ title: 'Failed to delete record', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Adjunct Faculty</h1>
          <p className="text-muted-foreground">Manage adjunct faculty collaborations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRecord(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Adjunct Faculty</DialogTitle>
              <DialogDescription>Fill in the adjunct faculty details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="facultyName">Faculty Name</Label>
                <Input id="facultyName" name="facultyName" defaultValue={editingRecord?.facultyName} required />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" defaultValue={editingRecord?.department} required />
              </div>
              <div>
                <Label htmlFor="courseCode">Course Code</Label>
                <Input id="courseCode" name="courseCode" defaultValue={editingRecord?.courseCode} required />
              </div>
              <Button type="submit" className="w-full">
                {editingRecord ? 'Update' : 'Add'} Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No adjunct faculty records found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {records.map((adj) => (
          <Card key={adj.id}>
            <CardHeader>
              <CardTitle>{adj.facultyName}</CardTitle>
              <CardDescription>{adj.department}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Course Code: </span>
                  <span className="font-medium">{adj.courseCode}</span>
                </div>
                {adj.supportingDocs && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Supporting Documents Available
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingRecord(adj);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(adj.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyAdjunctFaculty;
