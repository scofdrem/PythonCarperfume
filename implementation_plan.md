# Implementation Plan: Admin Username/Password Authentication

## [Overview]

Replace the OIDC authentication mechanism with a simpler admin username/password credential-based system. This implementation is complete and provides a secure credential-based login flow for admin access, replacing the broken OIDC token extraction in the URL fragment.

### Current State
The implementation is **complete** - all backend and frontend components have been implemented. The only remaining task is end-to-end verification of the authentication flow.

## [Types]

### Backend Schemas (app/backend/schemas/auth.py)
- `AdminLoginRequest`: Request schema with `username` and `password` fields
- `AdminLoginResponse`: Response schema with `token`, `expires_in`, and `user` fields
- `UserResponse`: User info schema with `id`, `email`, `name`, `role`, `last_login`

### Frontend Types
- `LoginCredentials`: Type with `username` and `password` properties

## [Files]

### Backend - No New Files Required
- `app/backend/routers/auth.py` - Added POST `/api/v1/auth/login` endpoint (existing file modified)
- `app/backend/services/auth.py` - Added `_verify_password()` and `authenticate_admin()` methods (existing file modified)
- `app/backend/schemas/auth.py` - Added `AdminLoginRequest` and `AdminLoginResponse` schemas (existing file modified)

### Frontend - No New Files Required
- `app/frontend/src/api/authApi.ts` - New module with login/logout functions
- `app/frontend/src/lib/auth.ts` - Updated with Authorization header interceptor
- `app/frontend/src/contexts/AuthContext.tsx` - Updated login() to accept credentials
- `app/frontend/src/pages/AdminLogin.tsx` - New login page component
- `app/frontend/src/components/ProtectedAdminRoute.tsx` - Updated for token validation

## [Functions]

### Backend Functions
- `POST /api/v1/auth/login()` - New endpoint accepting username/password, validates credentials, issues JWT token
- `AuthService.authenticate_admin()` - Authenticates admin user by login field and password hash
- `AuthService._verify_password()` - Verifies password against PBKDF2 hash with salt

### Frontend Functions
- `authApi.login()` - Sends credentials to backend and stores token
- `RPApi.getCurrentUser()` - Fetches user info with Authorization header
- `RPApi.logout()` - Clears token and redirects

## [Classes]

### Backend Classes
- `AuthService` - Extended with admin authentication methods

### Frontend Classes
- `RPApi` - Extended with Authorization header interceptor and 401 handling

## [Dependencies]

No new external dependencies required. Uses existing:
- PBKDF2 for password hashing (built-in hashlib)
- JWT tokens via python-jose library
- Axios for HTTP requests in frontend

## [Testing]

### Verification Steps Required
1. **Login with correct credentials**: Submit admin credentials via `/admin/login` page
2. **Token storage**: Verify JWT token is stored in localStorage
3. **Authorization header**: Verify API calls include `Authorization: Bearer <token>` header
4. **Token expiration handling**: Test 401 response clears token and redirects to login
5. **Admin route protection**: Verify protected routes redirect to login when unauthenticated
6. **Role enforcement**: Verify non-admin users see insufficient permissions message

### Test Credentials
Admin credentials must be set via environment variables:
- `ADMIN_USER_ID` - Admin user ID
- `ADMIN_USER_EMAIL` - Admin email
- `ADMIN_USER_LOGIN` - Login username
- `ADMIN_PASSWORD_HASH` - PBKDF2 hash in format `salt:hash`

## [Implementation Order]

N/A - Implementation is complete. Only verification remains.

### Verification Task
1. Start backend server with admin credentials configured
2. Start frontend development server
3. Navigate to `/admin/login`
4. Enter admin credentials and submit
5. Verify redirect to `/admin/dashboard`
6. Test API calls include Authorization header
7. Test logout clears token
8. Test token expiration redirects to login