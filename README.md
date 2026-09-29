
# Rooted Wild

An API used to track nature photos

## Tech Stack

**Client:** HTML, TailwindCSS

**Server:** Node, Express, Mongoose, Cloudinary


## Installation

Install with npm

```bash
  npm install
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` - Port to run server on

`NODE_ENV` - The current environment ('development', 'production', or 'test')

`MONGODB_URI` - MongoDB connection string

`CLOUD_NAME` - Cloudinary cloud name

`UPLOAD_PRESET` - Cloudinary upload preset name

`CLOUDINARY_KEY` - Cloudinary API key

`CLOUDINARY_KEY` - Cloudinary API secret

## Deployment

To deploy this project run

```bash
  npm run start
```

## API Reference

#### Health check

```http
  GET /health
```

Returns the API status. Response: `200 OK`

```json
{ "status": "ok" }
```

#### Get all observations

```http
  GET /api/v1/observations
```

Returns every observation, optionally filtered and sorted. Response: `200 OK`

```json
{ "success": true, "data": [] }
```

**Query parameters**

| Parameter | Type   | Description                                                                 |
| :-------- | :----- | :-------------------------------------------------------------------------- |
| `species` | string | Filter by exact species match.                                              |
| `sort`    | string | Sort field. Prefix with `-` for descending order (e.g. `-createdAt`).       |

**Allowed sort fields:** `createdAt`, `timesSeen`, `id`, `species`, `time`

**Allowed filter fields:** `species`

**Examples**

```http
  GET /api/v1/observations?species=American%20Beaver
  GET /api/v1/observations?sort=-createdAt
  GET /api/v1/observations?species=oak&sort=time
```

Error response: `400 Bad Request`

```json
{ "success": false, "error": { "message": "Invalid sort field" } }
```

#### Get one observation

```http
  GET /api/v1/observations/${id}
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `id`      | `int` | **Required**. Id of the observation to fetch |

Response: `200 OK` or `404 Not Found`

#### Create an observation

```http
  POST /api/v1/observations
```

| Body                              | Type       | Description                                    |
| :--------------------------------- | :--------- | :---------------------------------------------- |
| `species`                          | `string`   | **Required**. Species observed                  |
| `location.type`                    | `string`   | **Required**. Must be `"Point"`                  |
| `location.coordinates.latitude`    | `number`   | **Required**. Latitude of the sighting           |
| `location.coordinates.longitude`   | `number`   | **Required**. Longitude of the sighting          |
| `time`                             | `date`     | **Required**. When it was observed (ISO 8601)    |
| `photos`                           | `object[]` | Optional. Array of `{ url, publicId }` objects   |
| `photos[].url`                     | `string`   | **Required** (if photo provided). Photo URL      |
| `photos[].publicId`                | `string`   | **Required** (if photo provided). Cloudinary public ID |
| `timesSeen`                        | `number`   | Optional. Defaults to `1`                        |
| `user.name`                        | `string`   | Optional. Name of the observer                   |

Example body:

```json
{
  "species": "Red-tailed hawk",
  "location": {
    "type": "Point",
    "coordinates": { "latitude": 33.45, "longitude": -112.07 }
  },
  "time": "2026-09-20T14:30:00Z",
  "photos": [
    { "url": "https://example.com/hawk.jpg", "publicId": "hawk_123" }
  ],
  "timesSeen": 2,
  "user": { "name": "Sam" }
}
```

Response: `201 Created` with the new observation, or `400 Bad Request` if validation fails

#### Replace an observation

```http
  PUT /api/v1/observations/${id}
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `id`      | `int` | **Required**. Id of the observation to replace |

Body: the full observation object (all required fields).
Response: `200 OK`, `400 Bad Request`, or `404 Not Found`

#### Update an observation

```http
  PATCH /api/v1/observations/${id}
```

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `id`      | `int` | **Required**. Id of the observation to update |

Body: any subset of the observation fields.
Response: `200 OK`, `400 Bad Request`, or `404 Not Found`

#### Delete an observation

```http
  DELETE /api/v1/observations/${id}
```

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `id`      | `int` | **Required**. Id of the observation to delete |

Response: `204 No Content` (empty body), or `404 Not Found`

#### Get client config

```http
  GET /api/v1/config
```

Returns the public Cloudinary settings the front end needs (loaded from .env). Response: `200 OK`

```json
{
  "success": true,
  "data": { "cloudName": "string", "uploadPreset": "string" }
}
```

#### Front end

```http
  GET /
```

Serves the `new_post.html` page and static files from `/public`.

#### Error format

All errors use one shape:

```json
{ "success": false, "error": { "message": "string" } }
```
## Architecture

### Routes
Request goes to route files and route calls the corresponding controller function.

### Controllers
Recieves request and sends proper data to service layer. Sends back response if there's no errors.

### Services
Gets the data from the database and performs business logic. If there's an error, it throws here and sends it to the middleware.

### Database
Stores all the records and serves them to the service layer.
## Future Development

### Authentication
The framework for users already exists and can be built on using the frontend as well.

### Users
Adding authentication allows me to solidify the already existing business rules for editing/deleting observations.

#### Badges
Adding in specific users will allow me to develop the extra planned systems like stats and badges for each user.

### Front end
Once users own their own posts, I can develop the frontend into a full social app.