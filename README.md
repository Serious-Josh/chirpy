# Chirpy
Chripy is a web server framework for a social media platform; Twitter but Chirpy.

## Installation
### Required Prerequisites
- Node.js lts
- PostgreSQL database

### Setup
1. Clone the repo
```
git clone https://github.com/Serious-Josh/chirpy.git
cd chripy
```

2. Install project dependencies
```
npm install
```

3. Make sure PostgreSQL is running and create a database named 'chirpy'.
The default database configuration is:
```
DB_URL="postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable"
```
If your PostgreSQL configuration file differs, update DB_URL in the .env file to match.

4. Run database migrations:
```npm run generate
npm run migrate
```

### Running the Web Server
To run the server in development mode:
```
npm run dev
```


# API Documentation
The Chripy API provides endpoints for user management, authentication, chirp management, webhooks, and administration commands.
Unless a blank response, the API will always return JSON responses.

## Base URL
The api runs off of:
```
https://localhost:8080
```
The port may vary if changed within the .env file.

### Authentication Note
Authentication endpoints use a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### Status
**GET /api/healthz**

Checks if the API is currently running.

*Response*: 200 OK

### Users
**POST /api/users**

Creates a new user.

*Request Body*:
```json
{
    "email": "user@example.com",
    "password": "password"
}
```

*Response*: 201 Created
```json
{
    "id": "user-id",
    "email": "user@example.com",
    "isChirpyRed": false,
    "createdAt": "...",
    "updatedAt": "..."
}
```

User passswords are not included in the response body.

**PUT /api/users**
Updates the uathenticated user's email and password.

*Authentication*: Required

*Request Body*:
```json
{
    "email": "newemail@example.com",
    "password": "newpassword"
}
```

*Response*: 200 OK

Returns the updated user without their new password.

### Authentication

**POST /api/login**
Authenticates a user and generates an access token and refresh token.

*Request Body*:
```json
{
    "email": "user@example.com",
    "password": "password"
}
```

*Response*: 200 OK
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "isChirpyRed": false,
  "createdAt": "...",
  "updatedAt": "...",
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```
JWT access tokens expire after 1 hour, while refresh tokens expire after 60 days.

*Invalid credentials*: 401 Unauthorized


**POST /api/refresh**
Generates a new access JWT token using a valid refresh token.

*Authentication*: Refresh token required
```
Authorization: Bearer <refresh-token>
```

*Response*: 200 OK
```json
{
    "token": "new-jwt-token"
}
```

*Invalid refresh token*: 401 Unauthorized


**POST /api/revoke**
Revokes the refresh token supplied in the Authorization header.

*Authentication*: Refresh token required
```
Authorization: Bearer <refresh-token>
```

*Response*: 204 No Content


### Chirps

**POST /api/chirps**
Creates a new chirp for the authenticated user.

*Authentication*: Required

*Request Body*:
```json
{
    "body": "This is my new chrip!"
}
```

Chrips are limited to 140 characters.

The following words are automatically replaced with '****':
- kerfuffle
- sharbert
- fornax
The filtering is case-insentive.

*Response*: 201 Created

Returns the newly created chirp.

*Example*:
```json
{
    "id": "chirp-id",
    "body": "This is my new chirp!",
    "userId": "user-id",
    "createdAt": "..."
}
```

*Chirp exceeds 140 characters*: 400 Bad Request


**GET /api/chirps**
Retrives chirps.
By default all chrips are returned.

*Query Parameters*
- authorId
Filters chrips by author:
```
GET /api/chirps?authorId=user-id
```

- sort
Sorts chirps by creation date.
```
GET /api/chirps?sort=asc
```

Available values:
- asc - oldest first
- desc - newest first

The parameters can be combined:
```
GET /api/chirps?authorId=user-id&sort=desc
```

*Response*: 200 OK
Returns an array of chirps.


**GET /api/chirps/:chripId**
Retrives a single chirp corresponding to the specific chripId.

*Example*:
```
GET /api/chirps/23
```

*Response*: 200 OK

Returns the requested chirp.

*Chirp not found*: 404 Not Found


**DELETE /api/chirps/:chirpId**
Deletes a single chirp corresponding to the specific chirpId.

*Authentication*: Required
The authenticated user must be the owner of the specified chirp.

*Example*:
```
DELETE /api/chirps/23
Authentication: Bearer <token>
```

*Response*: 204 No Content

*Chirp not found*: 404 Not Found

*User does not own specified chirp*: 403 Forbidden


### Webhooks
**POST /api/polka/webhooks**
Handles Polka webhook events.
The request must contain the Polka API key in the Authorization header.
The endpoint currently handles the user.upgraded event.

*Example Request*:
```json
{
    "event": "user.upgraded",
    "data": {
        "userId": "user-id"
    }
}
```

When the event is user.upgraded, the user's Chirpy Red status is upgraded.
Other event types are ignored.

*Response*: 204 No Content

*Invalid API key*: 401 Unauthorized

*User not found*: 404 Not Found


### Admin
The admin endpoints are mounted separately from the main API router.

**GET /admin/metrics**
Returns an HTML page containing the number of times the API server has been accessed.

*Response*: 200 OK

Example:
```
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited 10 times!</p>
  </body>
</html>
```


**POST /admin/reset**
Resets the server hit counter and clears all users.
This endpoint is only available when the application platform is set to dev in .env

*Response*: 200 OK

When the application is not running in development mode:
*Response*: 403 Forbidden