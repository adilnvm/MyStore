# DB Migration Guide – Local PostgreSQL → Render PostgreSQL (MyStore)

This document explains **all steps** to:

1. Export the **local** PostgreSQL database.
2. Import it into a **new Render PostgreSQL** instance.
3. Configure the **Spring Boot backend** to use the new Render DB.
4. Verify everything using **psql**, **backend APIs**, and **frontend**.

Use this as `db-migration.md` in your repo.

---

## 0. Current Production DB Details (Render)

> ⚠️ Never commit real passwords to Git. Replace placeholders with your actual values when running commands.

From the Render PostgreSQL service:

- **External Hostname** (example pattern):  
  `dpg-d4j1sfnpm1nc73e3i8i0-a.<region>-postgres.render.com`
- **Internal Hostname** (only for other Render services):  
  `dpg-d4j1sfnpm1nc73e3i8i0-a`
- **Database Name:** `dbtest2_evic`
- **Username:** `user_dbtest2`
- **Password:** `<RENDER_DB_PASSWORD>`
- **Port:** `5432`

**JDBC URL pattern used by Spring Boot:**

```
jdbc:postgresql://dpg-d4j1sfnpm1nc73e3i8i0-a.<region>-postgres.render.com:5432/dbtest2_evic
````

Replace `<region>` and `<RENDER_DB_PASSWORD>` with your actual values from the Render dashboard.

---

## 1. Prerequisites

### 1.1 On Local Machine (Windows / PowerShell)

* PostgreSQL client tools installed:

  * `pg_dump`
  * `pg_restore`
  * `psql`
* Access to the **source** database (local DB with all data):

  Example local DB:

  * Host: `localhost`
  * Port: `5432`
  * Database: `ecommerce_db`
  * User: `postgres`
  * Password: `<LOCAL_DB_PASSWORD>`

### 1.2 On Render

* A **new PostgreSQL service** created.
* You have noted its:

  * External hostname: `dpg-...<region>-postgres.render.com`
  * DB name: `dbtest2_evic`
  * Username: `user_dbtest2`
  * Password: `<RENDER_DB_PASSWORD>`
  * Port: `5432`

---

## 2. Step 1 – Export Local PostgreSQL DB (pg_dump)

We will create a **custom-format dump file** from the local Postgres DB.

### 2.1 Handle SSL error (if any)

If you ever see:

```
server does not support SSL, but SSL was required
```

it means your local server has no SSL, but the client is forcing SSL. Disable SSL for the local dump:

```powershell
$env:PGSSLMODE = "disable"
```

### 2.2 Run pg_dump on local DB

```powershell
$env:PGPASSWORD = "<LOCAL_DB_PASSWORD>"   # if local Postgres uses a password
$env:PGSSLMODE = "disable"               # local DB usually doesn’t use SSL

pg_dump `
  -h localhost `
  -p 5432 `
  -U postgres `
  -Fc `
  -d ecommerce_db `
  -f C:\temp\backup_ecommerce_new.dump
```

**Options explained:**

* `-h localhost` → host of local Postgres.
* `-p 5432` → port (default).
* `-U postgres` → local DB user.
* `-Fc` → **custom format** (recommended for `pg_restore`).
* `-d ecommerce_db` → source DB name.
* `-f C:\temp\backup_ecommerce_new.dump` → output dump file path.

### 2.3 Verify dump file

```powershell
ls C:\temp\backup_ecommerce_new.dump
```

File must exist and have **non-zero** size.

---

## 3. Step 2 – Restore Dump into New Render PostgreSQL (pg_restore)

Now we import the dump into the **new Render DB**.

> ⚠️ Use the **external hostname** ending with `.render.com`, not the internal one.

### 3.1 Configure environment for Render DB

```powershell
$env:PGPASSWORD = "<RENDER_DB_PASSWORD>"
$env:PGSSLMODE = "require"   # Render PG normally requires SSL
```

### 3.2 Run pg_restore

```powershell
pg_restore `
  -h dpg-d4j1sfnpm1nc73e3i8i0-a.<region>-postgres.render.com `
  -p 5432 `
  -U user_dbtest2 `
  -d dbtest2_evic `
  --clean `
  --no-owner `
  --no-privileges `
  -v C:\temp\backup_ecommerce_new.dump
```

**Options:**

* `--clean` → drop existing objects before recreating (safe for fresh DB).
* `--no-owner` → do not restore original object owners (avoids permission issues).
* `--no-privileges` → do not restore GRANTs (avoids unwanted permission errors).
* `-v` → verbose output.

If no fatal errors appear, the new Render DB now has all tables and data from the local DB.

---

## 4. Step 3 – Verify Data in Render DB (psql)

Use `psql` to check tables and counts.

```powershell
$env:PGPASSWORD = "<RENDER_DB_PASSWORD>"
$env:PGSSLMODE  = "require"

psql `
  -h dpg-d4j1sfnpm1nc73e3i8i0-a.<region>-postgres.render.com `
  -p 5432 `
  -U user_dbtest2 `
  -d dbtest2_evic
```

Inside `psql`:

```sql
-- list tables
\dt;

-- check core tables
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM cart_items;
SELECT COUNT(*) FROM wishlist_items;

-- inspect a few rows
SELECT * FROM products LIMIT 5;
SELECT * FROM users LIMIT 5;

\q
```

If table names and row counts match the old DB, **migration at DB level is successful**.

---

## 5. Step 4 – Configure Spring Boot Backend to Use New Render DB

The backend is the Spring Boot module (`jpl-backend`).

We configure it via **environment variables** on the Render Web Service
and map them in `application.properties`.

### 5.1 Set env vars on Render backend service

On Render dashboard → your backend service → **Environment**:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-d4j1sfnpm1nc73e3i8i0-a.<region>-postgres.render.com:5432/dbtest2_evic
SPRING_DATASOURCE_USERNAME=user_dbtest2
SPRING_DATASOURCE_PASSWORD=<RENDER_DB_PASSWORD>
```

Keep any additional vars you use (e.g. `JWT_SECRET`, `JWT_EXPIRATION_MS`, `ALLOWED_CORS_ORIGINS`, `VITE_API_BASE_URL`, etc.).

### 5.2 application.properties configuration

In `jpl-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

server.port=10000
```

Spring Boot will now use the DB pointed to by `SPRING_DATASOURCE_*`.

### 5.3 Redeploy backend

On Render:

* Press **“Deploy Latest”** (or push a commit to trigger deployment).

Then open backend logs. At successful startup you should see lines like:

```text
HikariDataSource       : HikariPool-1 - Starting...
HikariDataSource       : HikariPool-1 - Start completed.
HHH10001005: Database info:
  Database JDBC URL [jdbc:postgresql://dpg-d4j1sfnpm1nc73e3i8i0-a.<region>-postgres.render.com:5432/dbtest2_evic]
  Database: PostgreSQL ...
```

No datasource errors should appear.

---

## 6. Step 5 – Backend API Verification

Once backend is up with the new DB, verify via HTTP.

### 6.1 Products API

```text
https://<BACKEND_SERVICE_NAME>.onrender.com/api/products
```

Expected:

* JSON array of products.
* Matches the data you saw via `psql`.

### 6.2 Users API

```text
https://<BACKEND_SERVICE_NAME>.onrender.com/api/users
```

Expected:

* JSON array of users.

### 6.3 Login (JWT-based)

Use `curl` or Postman. Example (PowerShell, escaping quotes):

```powershell
curl -i -X POST "https://<BACKEND_SERVICE_NAME>.onrender.com/api/users/login" `
  -H "Content-Type: application/json" `
  -d "{""username"":""testuser"",""password"":""123456""}"
```

Expected JSON:

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "CUSTOMER",
    "createdAt": "..."
  }
}
```

Use the returned token to call protected endpoints, e.g.:

```powershell
curl -i "https://<BACKEND_SERVICE_NAME>.onrender.com/api/orders" `
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Should return `200 OK` with order data (if any).

---

## 7. Step 6 – Frontend (Vite React) Verification

The frontend is a Vite React app deployed as a **Static Site** on Render.

It talks to the backend using the environment variable:

```env
VITE_API_BASE_URL=https://<BACKEND_SERVICE_NAME>.onrender.com
```

### 7.1 Check frontend env on Render

On Render → your static site → **Environment**, set:

```env
VITE_API_BASE_URL=https://<BACKEND_SERVICE_NAME>.onrender.com
```

Redeploy the static site (since Vite reads env at build time).

### 7.2 Test in Browser

Open:

```text
https://<FRONTEND_SERVICE_NAME>.onrender.com/
```

Verify:

* Home page loads and product grid shows data.
* Clicking product details, wishlist, cart, orders works (after login).
* Login and registration work; new users appear in the `users` table if you query via `psql`.

If all of the above is true, your **end-to-end migration is complete**.

---

## 8. Troubleshooting

### 8.1 pg_dump SSL error (local)

Error:

```text
server does not support SSL, but SSL was required
```

Fix:

```powershell
$env:PGSSLMODE = "disable"
```

Re-run `pg_dump`.

### 8.2 pg_restore hostname error

Error:

```text
could not translate host name "dpg-...-a" to address: Name or service not known
```

Cause:

* Using internal Render hostname (`dpg-...-a`) from your laptop.

Fix:

* Use external hostname with `.render.com`:

  ```text
  dpg-d4j1sfnpm1nc73e3i8i0-a.<region>-postgres.render.com
  ```

### 8.3 Authentication error on pg_restore / psql

Check:

* `$env:PGPASSWORD` = `<RENDER_DB_PASSWORD>`
* `-U` = `user_dbtest2`
* `-d` = `dbtest2_evic`

### 8.4 Spring Boot startup errors (datasource)

Look for:

* Typos in `SPRING_DATASOURCE_URL` (wrong host, DB name, or port).
* Wrong username or password.
* Missing env vars in Render.

### 8.5 Frontend “Failed to fetch” / CORS

Ensure:

* Backend has correct CORS config.

* `ALLOWED_CORS_ORIGINS` env var includes:

  ```env
  ALLOWED_CORS_ORIGINS=https://<FRONTEND_SERVICE_NAME>.onrender.com,http://localhost:5173
  ```

* No conflicting CORS configs in multiple classes.

---

## 9. Ultra-Short Migration Checklist

1. **Dump local DB:**

   ```powershell
   $env:PGPASSWORD = "<LOCAL_DB_PASSWORD>"
   $env:PGSSLMODE = "disable"
   pg_dump -h localhost -p 5432 -U postgres -Fc -d ecommerce_db -f C:\temp\backup_ecommerce_new.dump
   ```

2. **Restore to new Render DB:**

   ```powershell
   $env:PGPASSWORD = "<RENDER_DB_PASSWORD>"
   $env:PGSSLMODE = "require"
   pg_restore -h dpg-d4j1sfnpm1nc73e3i8i0-a.<region>-postgres.render.com `
              -p 5432 -U user_dbtest2 -d dbtest2_evic `
              --clean --no-owner --no-privileges -v C:\temp\backup_ecommerce_new.dump
   ```

3. **Verify with psql** (`\dt`, `SELECT COUNT(*) FROM products;`).

4. **Set Spring Boot env vars** (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`) on Render, redeploy.

5. **Test backend APIs**: `/api/products`, `/api/users`, `/api/users/login`, protected routes.

6. **Set `VITE_API_BASE_URL`** on frontend static service, redeploy, and test UI.

---

```
```
