# API Testing Guide

## Base URL
```
http://localhost:3001
```

## Common "Invalid URL" Errors

### ❌ Wrong URL Formats:
- `localhost:3001/api/auth/register` - Missing `http://`
- `http://localhost:3001/api/auth/register/` - Extra trailing slash (sometimes causes issues)
- `https://localhost:3001/api/auth/register` - Using `https` instead of `http`
- `http://127.0.0.1:3001/api/auth/register` - This works, but prefer `localhost`

### ✅ Correct URL Format:
```
http://localhost:3001/api/auth/register
```

---

## API Endpoints

### 1. Health Check (Test if server is running)
```http
GET http://localhost:3001/api/health
```

### 2. Register User
```http
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "faculty",
  "department": "Computer Science",
  "designation": "Assistant Professor"
}
```

### 3. Login
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "role": "faculty"
}
```

### 4. Get Current User
```http
GET http://localhost:3001/api/auth/me
user-id: [USER_ID_HERE]
```

---

## Testing Methods

### Method 1: Using Postman

1. **Create a new request**
2. **Set method to POST**
3. **Enter URL**: `http://localhost:3001/api/auth/register`
4. **Go to Headers tab**:
   - Key: `Content-Type`
   - Value: `application/json`
5. **Go to Body tab**:
   - Select `raw`
   - Select `JSON` from dropdown
   - Paste the JSON body
6. **Click Send**

### Method 2: Using cURL (Command Line)

```bash
# Register User
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "faculty",
    "department": "Computer Science"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "faculty"
  }'

# Health Check
curl http://localhost:3001/api/health
```

### Method 3: Using PowerShell (Windows)

```powershell
# Register User
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "faculty",
    "department": "Computer Science"
  }'

# Health Check
Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET
```

### Method 4: Using Browser (GET requests only)

Open in browser:
```
http://localhost:3001/api/health
```

### Method 5: Using JavaScript/Fetch

```javascript
// Register User
fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'faculty',
    department: 'Computer Science'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

---

## Troubleshooting

### Error: "Invalid URL"
- ✅ Make sure URL starts with `http://` or `https://`
- ✅ Check for typos in the URL
- ✅ Ensure server is running on port 3001
- ✅ Verify no extra spaces in the URL

### Error: "Cannot connect"
- ✅ Check if server is running: `npm start` in server directory
- ✅ Verify MongoDB is running
- ✅ Check if port 3001 is available

### Error: "404 Not Found"
- ✅ Check the endpoint path is correct: `/api/auth/register`
- ✅ Verify the route exists in the server code
- ✅ Make sure you're using the correct HTTP method (GET, POST, etc.)

### Error: "400 Bad Request"
- ✅ Check if all required fields are included
- ✅ Verify JSON format is correct
- ✅ Ensure `Content-Type: application/json` header is set

### Error: "500 Internal Server Error"
- ✅ Check server console for error messages
- ✅ Verify MongoDB connection
- ✅ Check if all required dependencies are installed

---

## Quick Test Checklist

- [ ] Server is running (`npm start` in server directory)
- [ ] MongoDB is running
- [ ] URL format is correct: `http://localhost:3001/api/...`
- [ ] Content-Type header is set: `application/json`
- [ ] JSON body is valid
- [ ] All required fields are included
- [ ] No typos in endpoint path

---

## Example Test Sequence

1. **Test Health Check**:
   ```
   GET http://localhost:3001/api/health
   ```
   Expected: `{ "status": "OK", "message": "Server is running" }`

2. **Register a User**:
   ```
   POST http://localhost:3001/api/auth/register
   ```
   Expected: `{ "message": "User registered successfully", "user": {...} }`

3. **Login**:
   ```
   POST http://localhost:3001/api/auth/login
   ```
   Expected: `{ "message": "Login successful", "user": {...} }`

4. **Check MongoDB Compass**:
   - Database: `FDP`
   - Collection: `users`
   - Should see the new user document
