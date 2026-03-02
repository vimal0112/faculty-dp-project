import { useState, useEffect } from 'react';
import { FileSpreadsheet, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminAPI } from '@/lib/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminAdjunctFaculty = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAdjunctFaculty();
      setRecords(data || []);
    } catch (error) {
      console.error('Failed to load adjunct faculty records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter((record: any) =>
    record.facultyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.courseCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      records.map((record: any) => ({
        'Faculty ID': record.facultyId?._id || record.facultyId || 'N/A',
        'Faculty Name': record.facultyId?.name || 'N/A',
        'Adjunct Faculty Name': record.facultyName,
        'Department': record.department,
        'Course Code': record.courseCode,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Adjunct Faculty');
    XLSX.writeFile(workbook, 'Adjunct_Faculty_Records.xlsx');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Adjunct Faculty Records', 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [['Faculty', 'Adjunct Faculty', 'Department', 'Course Code']],
      body: records.map((record: any) => [
        record.facultyId?.name || 'N/A',
        record.facultyName,
        record.department,
        record.courseCode,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save('Adjunct_Faculty_Records.pdf');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Adjunct Faculty Records</h1>
        <p className="text-muted-foreground">View and manage all adjunct faculty records</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Adjunct Faculty</CardTitle>
              <CardDescription>Total: {records.length} records</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={downloadExcel} variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button onClick={downloadPDF} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by faculty name, department, or course code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty ID</TableHead>
                  <TableHead>Adjunct Faculty Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record: any) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell className="font-medium">
                        {record.facultyId?.name || (record.facultyId?._id || record.facultyId || 'N/A').toString().substring(0, 8)}
                      </TableCell>
                      <TableCell>{record.facultyName}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{record.courseCode}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdjunctFaculty;
