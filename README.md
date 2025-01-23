# skins-ly

## How to start the project

1. Clone this repo
2. Create *.env* file
3. Add the following variables

- POSTGRES_URL - For connect to postgres
- PORT - port of application
- SKINPORT_API_CLIENT_ID - Client ID for Skinport API
- SKINPORT_API_SECRET - Secret for Skinport API
- REDIS_URL - For connect to redis

You can copy these variables from .env.example file

4. Install Node dependencies

```bash
npm i
```

5. Exec docker compose command to launch PostgreSQL

```
docker compose up -d
```

6. Build the application

```
npm run build
```

7. Start the application

```
npm run start
```

API requests examples in Postman collection (file *skinsly.postman_collection.json*)

## Default user scenario

- Authenticataction
  - Sign up, if you're new user. Exec ```POST /api/auth/signup```
  - Sign in, if you're existing user. Exec ```POST /api/auth/signin```

- Get skinport items
  - Exec ```GET /api/skinport/items```

- Topup user balance
  - Exec ```POST /api/users/topup-balance```

- Create a product
  - Exec ```POST /api/products```

- Create a purchase
  - Exec ```POST /api/purchases```