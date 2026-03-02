# Migration Guide: Mock Data to API

This guide explains how to update remaining pages to use API calls instead of mock data.

## Pattern to Follow

### 1. Import API functions
```typescript
import { facultyAPI } from '@/lib/api';
```

### 2. Replace useState with API calls
```typescript
// OLD:
const [records, setRecords] = useState<Type[]>(mockData.filter(...));

// NEW:
const [records, setRecords] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadRecords();
}, []);

const loadRecords = async () => {
  try {
    setLoading(true);
    const data = await facultyAPI.getFDPAttended();
    setRecords(data.map((item: any) => ({
      id: item._id || item.id,
      // Map other fields...
    })));
  } catch (error) {
    console.error('Failed to load records:', error);
    toast({ title: 'Failed to load records', variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};
```

### 3. Update CRUD operations
```typescript
// CREATE
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = {
    // Extract form data
  };
  
  try {
    if (editingRecord) {
      await facultyAPI.updateFDPAttended(editingRecord.id, data);
    } else {
      await facultyAPI.createFDPAttended(data);
    }
    await loadRecords(); // Reload data
    setIsDialogOpen(false);
  } catch (error) {
    toast({ title: 'Failed to save', variant: 'destructive' });
  }
};

// DELETE
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure?')) return;
  try {
    await facultyAPI.deleteFDPAttended(id);
    await loadRecords();
  } catch (error) {
    toast({ title: 'Failed to delete', variant: 'destructive' });
  }
};
```

### 4. Add loading states
```typescript
{loading ? (
  <div>Loading...</div>
) : records.length === 0 ? (
  <div>No records found</div>
) : (
  // Render records
)}
```

## Pages to Update

### Faculty Pages (Use `facultyAPI`)
- ✅ FacultyFDPAttended - DONE
- ✅ FacultyDashboard - DONE
- ⏳ FacultyFDPOrganized
- ⏳ FacultySeminars
- ⏳ FacultyABL
- ⏳ FacultyJointTeaching
- ⏳ FacultyAdjunctFaculty
- ⏳ FacultyNotifications
- ⏳ FacultyEvents
- ⏳ FacultyFDPs

### Admin Pages (Use `adminAPI`)
- ⏳ AdminDashboard
- ⏳ AdminFaculty
- ⏳ AdminFDPAttended
- ⏳ AdminFDPOrganized
- ⏳ AdminSeminars
- ⏳ AdminABL
- ⏳ AdminJointTeaching
- ⏳ AdminAdjunctFaculty
- ⏳ AdminNotifications
- ⏳ AdminSettings

### HOD Pages (Use `hodAPI`)
- ⏳ HODDashboard
- ⏳ HODFaculty
- ⏳ HODRecords
- ⏳ HODAnalytics
- ⏳ HODNotifications

## Important Notes

1. **ID Mapping**: API returns `_id` but components use `id`. Always map:
   ```typescript
   id: item._id || item.id
   ```

2. **Date Formatting**: API dates may be strings or Date objects:
   ```typescript
   date: new Date(item.date).toLocaleDateString()
   ```

3. **Error Handling**: Always wrap API calls in try-catch

4. **Loading States**: Show loading indicators while fetching data

5. **Authentication**: User ID is automatically sent via headers from localStorage

## API Base URL

The API base URL is configured in `client/src/lib/api.ts`:
- Default: `http://localhost:3000/api`
- Can be overridden with `VITE_API_URL` environment variable

## Testing

After updating each page:
1. Test CREATE operation
2. Test READ operation (list view)
3. Test UPDATE operation
4. Test DELETE operation
5. Verify data appears in MongoDB Compass
