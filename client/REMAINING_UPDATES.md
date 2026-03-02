# Remaining Pages to Update

## Completed ✅
- FacultyFDPAttended
- FacultyDashboard
- FacultyJointTeaching
- FacultyABL
- FacultySeminars
- FacultyFDPOrganized
- FacultyAdjunctFaculty
- FacultyNotifications
- FacultyEvents

## Still Need Updates

### Faculty Pages
- [ ] FacultyFDPs.tsx - Needs API integration

### Admin Pages (Use `adminAPI`)
- [ ] AdminDashboard.tsx
- [ ] AdminFaculty.tsx
- [ ] AdminFDPAttended.tsx
- [ ] AdminFDPOrganized.tsx
- [ ] AdminSeminars.tsx
- [ ] AdminABL.tsx
- [ ] AdminJointTeaching.tsx
- [ ] AdminAdjunctFaculty.tsx
- [ ] AdminNotifications.tsx

### HOD Pages (Use `hodAPI`)
- [ ] HODDashboard.tsx
- [ ] HODFaculty.tsx
- [ ] HODRecords.tsx
- [ ] HODAnalytics.tsx
- [ ] HODNotifications.tsx

## Pattern to Follow

Replace:
```typescript
import { mockData } from '@/data/mockData';
```

With:
```typescript
import { Type } from '@/types';
import { api } from '@/lib/api';
```

Add:
```typescript
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    const response = await api.getData();
    setData(response.map((item: any) => ({
      id: item._id || item.id,
      // map other fields
    })));
  } catch (error) {
    console.error('Failed to load:', error);
  } finally {
    setLoading(false);
  }
};
```
