## BASE URL
`http://localhost:8000/api`

## Authentication
All routes except `/auth/login ` and `/auth/register-user/` and `/auth/reigster-admin/` require authentication via JWT token in cookie. The token is automatically handled through cookies, so no manual token management is needed in the request headers.
- Cookie name: `USER_TOKEN`
- Cookie attributes: `HttpOnly, Secure`

## Error Responses
All endpoints may return these error responses:
```json
{"message": "Error message"}
```
Common error status codes:
- `400` - Bad Request
- `401` - Unauthorized 
-  `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error