# MongoDB Compass Not Updating - Troubleshooting Guide

## Common Issues and Solutions

### 1. **Refresh MongoDB Compass**
- Click the **Refresh** button in MongoDB Compass
- Or press `F5` to refresh the database view
- The data might already be there, but Compass needs to refresh

### 2. **Check Database Name**
The server connects to database: **`FDP`**
- Make sure you're viewing the correct database in MongoDB Compass
- The collection name is: **`users`** (Mongoose pluralizes "User" model)

### 3. **Check Collection Name**
- Model name: `User` → Collection name: **`users`** (lowercase, plural)
- Make sure you're looking at the `users` collection, not `User`

### 4. **Verify Connection**
- Check if MongoDB is running
- Verify the connection string: `mongodb://127.0.0.1:27017/FDP`
- Check server console for connection messages

### 5. **Check Server Logs**
When you make a POST request, check the server console for:
- "Register request received" - confirms request reached server
- "Saving user to database..." - confirms save attempt
- "User saved successfully" - confirms successful save
- Any error messages

### 6. **Test the API**
Use Postman, curl, or any API client to test:

```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "role": "faculty",
  "department": "Computer Science"
}
```

### 7. **Check MongoDB Compass Connection**
- In MongoDB Compass, make sure you're connected to: `mongodb://127.0.0.1:27017`
- Select the **FDP** database
- Look for the **users** collection

### 8. **Verify Data Was Saved**
Run this in MongoDB Compass or mongo shell:
```javascript
use FDP
db.users.find().pretty()
```

### 9. **Check for Errors**
- Look at server console for any error messages
- Check if the response from the API is successful (status 201)
- Verify the request body is correct

### 10. **Database Connection Issues**
If you see connection errors:
- Make sure MongoDB service is running
- Check if port 27017 is accessible
- Try restarting MongoDB service

## Quick Checklist

- [ ] MongoDB is running
- [ ] Server is running on port 3001
- [ ] Connected to database `FDP` in MongoDB Compass
- [ ] Looking at collection `users` (not `User`)
- [ ] Refreshed MongoDB Compass view
- [ ] Checked server console for logs
- [ ] API request returns status 201 (success)
- [ ] No errors in server console

## Still Not Working?

1. Check the server console output when making the request
2. Verify the response from the API endpoint
3. Try querying directly: `db.users.find()` in MongoDB shell
4. Check if there are any validation errors preventing save
