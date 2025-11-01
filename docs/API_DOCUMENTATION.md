# API Documentation

Complete API reference for the MERN Keycloak application.

## Base URL

```
http://localhost:5000
```

## Authentication

Most endpoints require a JWT token from Keycloak. Include it in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this structure:

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Error description"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Public Endpoints

### Get Public Information

Get general API information and available endpoints.

**Endpoint**: `GET /api/public`

**Authentication**: Not required

**Response**:
```json
{
  "message": "This is a public endpoint - no authentication required",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "endpoints": {
    "public": "/api/public",
    "secure": "/api/secure (requires authentication)",
    "profile": "/api/secure/profile (requires authentication)",
    "tasks": "/api/secure/tasks (requires authentication)",
    "admin": "/api/secure/admin (requires admin role)"
  }
}
```

### Health Check

Check API health status.

**Endpoint**: `GET /api/public/health`

**Authentication**: Not required

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 12345.67
}
```

---

## Protected Endpoints

### Test Authentication

Verify authentication is working.

**Endpoint**: `GET /api/secure`

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "This is a protected endpoint - authentication successful!",
  "user": {
    "sub": "user-id-here",
    "email": "user@example.com",
    "name": "username",
    "username": "username",
    "roles": ["user"],
    "clientRoles": []
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Get User Profile

Retrieve the authenticated user's profile.

**Endpoint**: `GET /api/secure/profile`

**Authentication**: Required

**Response**:
```json
{
  "keycloakInfo": {
    "sub": "abc-123-def",
    "email": "user@example.com",
    "name": "username",
    "username": "username",
    "roles": ["user"]
  },
  "dbProfile": {
    "_id": "mongodb-id",
    "keycloakId": "abc-123-def",
    "username": "username",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["user"],
    "lastLogin": "2024-01-01T12:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Update User Profile

Update the authenticated user's profile.

**Endpoint**: `PUT /api/secure/profile`

**Authentication**: Required

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "preferences": {
    "theme": "dark",
    "notifications": "enabled"
  }
}
```

**Response**:
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "_id": "mongodb-id",
    "keycloakId": "abc-123-def",
    "username": "username",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "preferences": {
      "theme": "dark",
      "notifications": "enabled"
    }
  }
}
```

---

## Task Endpoints

### Get All Tasks

Retrieve all tasks for the authenticated user.

**Endpoint**: `GET /api/secure/tasks`

**Authentication**: Required

**Response**:
```json
{
  "tasks": [
    {
      "_id": "task-id-1",
      "title": "Complete project",
      "description": "Finish the MERN stack project",
      "status": "in-progress",
      "priority": "high",
      "createdBy": "user-id",
      "dueDate": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Create Task

Create a new task.

**Endpoint**: `POST /api/secure/tasks`

**Authentication**: Required

**Request Body**:
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "dueDate": "2024-12-31"
}
```

**Validation**:
- `title`: Required, string
- `description`: Optional, string
- `priority`: Optional, enum: `low`, `medium`, `high` (default: `medium`)
- `dueDate`: Optional, date

**Response**: `201 Created`
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "new-task-id",
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "medium",
    "createdBy": "user-id",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Update Task

Update an existing task.

**Endpoint**: `PUT /api/secure/tasks/:id`

**Authentication**: Required

**URL Parameters**:
- `id`: Task ID

**Request Body**:
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "completed",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

**Validation**:
- User must own the task
- `status`: Optional, enum: `pending`, `in-progress`, `completed`
- `priority`: Optional, enum: `low`, `medium`, `high`

**Response**:
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "task-id",
    "title": "Updated Task",
    "status": "completed",
    ...
  }
}
```

**Error**: `404 Not Found` if task doesn't exist or user doesn't own it

### Delete Task

Delete a task.

**Endpoint**: `DELETE /api/secure/tasks/:id`

**Authentication**: Required

**URL Parameters**:
- `id`: Task ID

**Response**:
```json
{
  "message": "Task deleted successfully",
  "task": {
    "_id": "deleted-task-id",
    "title": "Deleted Task"
  }
}
```

**Error**: `404 Not Found` if task doesn't exist or user doesn't own it

---

## Admin Endpoints

All admin endpoints require the `admin` role.

### Get All Users

Retrieve all users in the system.

**Endpoint**: `GET /api/secure/admin/users`

**Authentication**: Required (Admin role)

**Response**:
```json
{
  "count": 2,
  "users": [
    {
      "_id": "user-1",
      "keycloakId": "abc-123",
      "username": "admin",
      "email": "admin@example.com",
      "roles": ["user", "admin"],
      "lastLogin": "2024-01-01T12:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "user-2",
      "keycloakId": "def-456",
      "username": "testuser",
      "email": "testuser@example.com",
      "roles": ["user"],
      "lastLogin": "2024-01-01T11:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get All Tasks

Retrieve all tasks from all users.

**Endpoint**: `GET /api/secure/admin/tasks`

**Authentication**: Required (Admin role)

**Response**:
```json
{
  "count": 5,
  "tasks": [
    {
      "_id": "task-1",
      "title": "Task 1",
      "status": "completed",
      "priority": "high",
      "createdBy": "user-id-1",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Statistics

Retrieve application statistics.

**Endpoint**: `GET /api/secure/admin/stats`

**Authentication**: Required (Admin role)

**Response**:
```json
{
  "stats": {
    "totalUsers": 10,
    "totalTasks": 50,
    "tasksByStatus": [
      { "_id": "pending", "count": 15 },
      { "_id": "in-progress", "count": 20 },
      { "_id": "completed", "count": 15 }
    ]
  }
}
```

### Delete User

Delete a user and all their tasks.

**Endpoint**: `DELETE /api/secure/admin/users/:id`

**Authentication**: Required (Admin role)

**URL Parameters**:
- `id`: MongoDB user ID (not Keycloak ID)

**Response**:
```json
{
  "message": "User and associated tasks deleted successfully",
  "user": {
    "_id": "deleted-user-id",
    "username": "deleteduser",
    "email": "deleted@example.com"
  }
}
```

**Error**: `404 Not Found` if user doesn't exist

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Title is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

or

```json
{
  "error": "Unauthorized",
  "message": "Token verification failed: invalid signature"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Required role: admin"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error",
  "message": "Database connection failed"
}
```

---

## Rate Limiting

Currently not implemented. Consider adding rate limiting in production:
- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- Admin endpoints: 500 requests/minute

## Pagination

Not currently implemented for list endpoints. Consider adding for production:

```
GET /api/secure/tasks?page=1&limit=10
```

## Filtering and Sorting

Example future enhancements:

```
GET /api/secure/tasks?status=completed&priority=high&sort=-createdAt
```

## WebSocket Support

Not currently implemented. Consider for real-time features:
- Live notifications
- Real-time task updates
- User presence

## API Versioning

Consider versioning for production:

```
/api/v1/secure/tasks
/api/v2/secure/tasks
```

---

## Testing with cURL

### Get Public Data
```bash
curl http://localhost:5000/api/public
```

### Get Protected Data (with token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/secure
```

### Create Task
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"high"}' \
  http://localhost:5000/api/secure/tasks
```

### Update Task
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}' \
  http://localhost:5000/api/secure/tasks/TASK_ID
```

### Delete Task
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/secure/tasks/TASK_ID
```

---

## Testing with Postman

1. Create a new collection
2. Set up environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: Your Keycloak JWT token

3. Add requests for each endpoint
4. Use `{{base_url}}` and `{{token}}` in requests

### Getting a Token

1. Login to the React app
2. Open browser DevTools
3. Run in console:
```javascript
console.log(keycloak.token)
```
4. Copy the token to Postman

---

## Additional Notes

- All timestamps are in ISO 8601 format (UTC)
- MongoDB IDs are 24-character hex strings
- Keycloak user IDs are UUIDs
- Token expiration is configurable in Keycloak (default: 5 minutes)
- Refresh tokens are handled automatically by Keycloak.js on frontend
