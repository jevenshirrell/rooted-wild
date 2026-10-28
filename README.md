# Rooted Wild

An API used to track nature photos. Users create an account, log in, and post observations (a species, where and when it was seen, and photos). Anyone can browse observations; only logged-in users can create, change or delete them.

## Tech Stack

**Client:** HTML, TailwindCSS, vanilla JavaScript

**Server:** Node, Express, Mongoose (MongoDB)

**Auth:** bcryptjs, jsonwebtoken

**Images:** Cloudinary 

## Installation

```bash
  npm install
```

## Environment Variables

Copy `.env.example` to `.env` and fill in real values. The server exits on startup if any of these are missing. `.env` is in `.gitignore` and must never be committed.

| Variable            | Description                                                         |
| :------------------ | :------------------------------------------------------------------ |
| `PORT`              | Port to run the server on                                           |
| `NODE_ENV`          | `development`, `production`, or `test`                              |
| `MONGODB_URI`       | MongoDB connection string                                           |
| `CLOUD_NAME`        | Cloudinary cloud name                                               |
| `UPLOAD_PRESET`     | Cloudinary upload preset name                                       |
| `CLOUDINARY_KEY`    | Cloudinary API key                                                  |
| `CLOUDINARY_SECRET` | Cloudinary API secret                                               |
| `JWT_SECRET`        | Secret used to sign and verify login tokens. Use a long random string |
| `JWT_EXPIRES_IN`    | How long a token stays valid (e.g. `7d`)                            |

## Running the Application

```bash
  npm run dev     # development, restarts on changes (nodemon)
  npm run start   # production
```

The server listens on `http://localhost:<PORT>`. The front end is served at `/`, `/login` and `/signup`.

## Authentication

Register or log in to receive a token, then send it on protected requests:

```http
  Authorization: Bearer <token>
```

| Situation                                   | Response           |
| :------------------------------------------ | :----------------- |
| Header missing or not in `Bearer <token>` form | `401 Unauthorized` |
| Token invalid, forged or expired            | `401 Unauthorized` |
| Account in the token no longer exists       | `401 Unauthorized` |

Passwords are hashed with bcrypt before saving and are never returned in any response. New accounts always receive the `user` role; any `role` sent in the register body is ignored. Roles defined: `user`, `admin`, `owner`.

## API Reference

All successful responses use `{ "success": true, "data": ... }`. List responses also include a `meta` object. All errors use one shape (see [Error format](#error-format)).

| Endpoint                          | Needs token |
| :-------------------------------- | :---------- |
| `GET /health`                     | No          |
| `POST /api/v1/auth/register`      | No          |
| `POST /api/v1/auth/login`         | No          |
| `GET /api/v1/auth/me`             | **Yes**     |
| `GET /api/v1/observations`        | No          |
| `GET /api/v1/observations/:id`    | No          |
| `POST /api/v1/observations`       | **Yes**     |
| `PUT /api/v1/observations/:id`    | **Yes**     |
| `PATCH /api/v1/observations/:id`  | **Yes**     |
| `DELETE /api/v1/observations/:id` | **Yes**     |
| `GET /api/v1/config`              | No          |

### Health

#### Health check

```http
  GET /health
```

Returns the API and database status. Not under `/api/v1` because it is not part of the API itself. Response: `200 OK`

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected",
    "uptime": 123.45,
    "timestamp": "2026-10-28T12:00:00.000Z"
  }
}
```

### Auth

#### Register

```http
  POST /api/v1/auth/register
```

| Body       | Type     | Description                                  |
| :--------- | :------- | :------------------------------------------- |
| `name`     | `string` | **Required**. Max 60 characters              |
| `email`    | `string` | **Required**. Valid, unique email (stored lowercase) |
| `password` | `string` | **Required**. At least 8 characters          |

Only these three fields are read; anything else (including `role`) is ignored.

Response: `201 Created`

```json
{
  "success": true,
  "data": {
    "user": { 
      "id": "...", 
      "name": "Sam", 
      "email": "sam@example.com", 
      "role": "user" 
    },
    "token": "<jwt>"
  }
}
```

Errors: `400 Bad Request` (missing/invalid field, short password), `409 Conflict` (email already registered)

#### Log in

```http
  POST /api/v1/auth/login
```

| Body       | Type     | Description       |
| :--------- | :------- | :---------------- |
| `email`    | `string` | **Required**      |
| `password` | `string` | **Required**      |

Response: `200 OK` with `{ "user": {...}, "token": "<jwt>" }` in `data`.

Errors: `400 Bad Request` (email or password missing), `401 Unauthorized` (`Invalid email or password`). An unknown email and a wrong password return the same message on purpose.

#### Get current user

```http
  GET /api/v1/auth/me
```

**Requires token.** Returns the user the token belongs to. Response: `200 OK`, or `401 Unauthorized`.

### Observations

#### Get all observations

```http
  GET /api/v1/observations
```

Public. Returns one page of observations, newest first by default. Response: `200 OK`

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 32,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

`total` is the number of records matching the current filter, not the size of the whole collection.

**Query parameters**

| Parameter | Type   | Default      | Description                                                                                     |
| :-------- | :----- | :----------- | :---------------------------------------------------------------------------------------------- |
| `page`    | number | `1`          | Page number. Invalid values (`abc`, `-4`) fall back to `1`.                                     |
| `limit`   | number | `20`         | Records per page. Invalid values fall back to `20`; anything above `100` is capped at `100`.    |
| `sort`    | string | `-createdAt` | Field to sort by. Prefix with `-` for descending. Comma-separate for multiple fields (`class,-time`). |
| `class`   | string | none         | Filter by class. Must be one of the allowed classes or the request returns `400`.               |
| `ownerId`   | string | none         | Filter by observation owner.               |
| `q`       | string | none         | Case-insensitive search on `species`. Special characters are escaped, so `c++` is searched literally. |

**Allowed sort fields:** `createdAt`, `updatedAt`, `species`, `time`, `class`

**Allowed classes:** `mammal`, `bird`, `reptile`, `amphibian`, `fish`, `insect`, `arachnid`, `plant`, `fungus`, `other`

**Filter fields:** `class` and `ownerId`. Search (`q`) covers the `species` text field.

**Examples**

```http
  GET /api/v1/observations?page=2&limit=10
  GET /api/v1/observations?class=bird
  GET /api/v1/observations?sort=-time
  GET /api/v1/observations?q=beaver
```

Errors: `400 Bad Request` for a sort field not on the whitelist (message lists the sortable fields) or a class that is not allowed (message lists the valid classes).

```json
{ "success": false, "error": { "message": "Cannot sort by 'password'. Sortable fields: createdAt, updatedAt, species, time, class" } }
```

#### Get one observation

```http
  GET /api/v1/observations/:id
```

| Parameter | Type     | Description                                    |
| :-------- | :------- | :--------------------------------------------- |
| `id`      | `string` | **Required**. MongoDB id of the observation    |

Response: `200 OK`, `400 Bad Request` (malformed id), or `404 Not Found`

#### Create an observation

```http
  POST /api/v1/observations
```

**Requires token.**

| Body                             | Type       | Description                                           |
| :------------------------------- | :--------- | :---------------------------------------------------- |
| `species`                        | `string`   | **Required**. 2 to 100 characters                     |
| `class`                          | `string`   | **Required**. One of the allowed classes above        |
| `location.type`                  | `string`   | **Required**. Must be `"Point"`                       |
| `location.coordinates.latitude`  | `number`   | **Required**. -90 to 90                               |
| `location.coordinates.longitude` | `number`   | **Required**. -180 to 180                             |
| `time`                           | `date`     | **Required**. When it was observed (ISO 8601). Cannot be in the future |
| `photos`                         | `object[]` | Optional. Array of `{ url, publicId }` objects        |
| `photos[].url`                   | `string`   | **Required** (if photo provided). Photo URL           |
| `photos[].publicId`              | `string`   | **Required** (if photo provided). Cloudinary public ID |

The owner is set from the token, never from the body. Any `ownerId` sent by the client is ignored.

Example body:

```json
{
  "species": "Red-tailed hawk",
  "class": "bird",
  "location": {
    "type": "Point",
    "coordinates": { 
      "latitude": 33.45, 
      "longitude": -112.07 
    }
  },
  "time": "2026-09-20T14:30:00Z",
  "photos": [
    { 
      "url": "https://example.com/hawk.jpg", 
      "publicId": "hawk_123" 
    }
  ]
}
```

Response: `201 Created` with the new observation (including its `ownerId`), `400 Bad Request` if validation fails, or `401 Unauthorized` without a valid token

#### Replace an observation

```http
  PUT /api/v1/observations/:id
```

**Requires token.** Body: the observation fields. Response: `200 OK`, `400 Bad Request`, `401 Unauthorized`, or `404 Not Found`

#### Update an observation

```http
  PATCH /api/v1/observations/:id
```

**Requires token.** Body: any subset of the observation fields. Response: `200 OK`, `400 Bad Request`, `401 Unauthorized`, or `404 Not Found`

#### Delete an observation

```http
  DELETE /api/v1/observations/:id
```

**Requires token.** Deletes the observation and its photos from Cloudinary. Response: `204 No Content` (empty body), `401 Unauthorized`, or `404 Not Found`

### Config

#### Get client config

```http
  GET /api/v1/config
```

Returns the public Cloudinary settings the front end needs (loaded from `.env`). Response: `200 OK`

```json
{
  "success": true,
  "data": { "cloudName": "string", "uploadPreset": "string" }
}
```

### Front end

| Route     | Page                          |
| :-------- | :---------------------------- |
| `/`       | `new_post.html` (upload form) |
| `/login`  | `login.html`                  |
| `/signup` | `signup.html`                 |

Static files are served from `/public`.

### Error format

All errors use one shape. `details` is included for validation errors, and `stack` only outside production for `500`s.

```json
{ "success": false, "error": { "message": "string" } }
```

| Code | Meaning                                                                     |
| :--- | :-------------------------------------------------------------------------- |
| 400  | Missing/invalid fields, bad query values, malformed id, malformed JSON      |
| 401  | No token, bad or expired token, wrong login                                 |
| 404  | Route or record does not exist                                              |
| 409  | Duplicate email                                                             |
| 413  | Request body larger than 10kb                                               |
| 500  | Server error                                                                |

## Architecture

```
Routes -> Controllers -> Services -> Database
```

### Routes
Route files define the method, URL and middleware (such as `requireAuth`) and call the matching controller function. `routes/index.js` mounts everything under `/api/v1`.

### Middleware
`requireAuth` reads the `Bearer` token, verifies it, loads the user from the database and sets `req.user` before the controller runs. `requestLogger` logs every request, `notFound` handles unknown routes, and a single global `errorHandler` turns every error into the standard error response.

### Controllers
Receive the request, pass the data to the service layer, and send the response through the shared response helpers (`sendSuccess`, `sendCreated`, `sendNoContent`).

### Services
Perform the business logic and database work (field whitelisting, pagination, filtering, image cleanup). If something goes wrong they throw an `ApiError`, which the error handler sends back.

### Utils
`queryFeatures.js` holds pagination, sorting, filtering, search escaping and the `meta` builder. `jwt.js` signs and verifies tokens. Defaults and whitelists (roles, page limits, sortable fields, classes) live in `config/constants.js`.

### Database
MongoDB stores users and observations. Each observation has an indexed `ownerId` referencing its creator.

## Future Development

### Authorization (Stage 3)
Every observation already records its `ownerId`, and `ApiError.forbidden` and the `user` / `admin` / `owner` roles are in place. Next step is checking `req.user` against the record's `ownerId` in the service layer on update and delete, with admins allowed to manage any observation.

### Badges and stats
With users attached to their observations, per-user stats and badges become possible.

### Front end
Once users own their own posts, the front end can grow into a full social app.