## MyStore – Full-Stack E-Commerce Application

This is a full-stack e-commerce app built with **Spring Boot**, **Vite (React)**, and **PostgreSQL**.

- **Storefront:** available at `/` – normal user-facing store with product listing, filtering, cart, wishlist, orders, and user profile.
- **Admin Panel:** available at `/admin` – admin dashboard for full **CRUD** on products and basic admin features.

I originally built this project to learn **Spring Boot**, but in the process I also picked up **PostgreSQL**, Docker, deployment on Render, and a typical full-stack deployment flow.

**Live app:**  
➡️ [MyStore on Render](https://mystore-v2na.onrender.com/)

---

## Tech Stack

- **Backend:** Spring Boot (Java 21, preview features enabled)
- **Frontend:** Vite (React) + Chakra UI components
- **Database:** PostgreSQL
- **Build & Dependency Management:** Maven (via Maven Wrapper)
- **Containerization:** Docker (multi-stage build)
- **Hosting:** Render
  - Web service for backend
  - Static site for frontend
  - Managed PostgreSQL service for DB

---

## Database & Migration

- The production database is a **managed PostgreSQL instance on Render**.
- The backend connects to the DB using **Render’s internal hostname** as an internal service (for lower latency and security).
- Initial data was developed on **local PostgreSQL** and then migrated to Render:

  1. Exported local DB using `pg_dump` into a custom dump file (`.dump`).
  2. Restored that dump into the Render PostgreSQL service using `pg_restore` and the **external** PostgreSQL URL.
  3. Configured the Spring Boot backend to use the Render DB via environment variables:
     - `SPRING_DATASOURCE_URL`
     - `SPRING_DATASOURCE_USERNAME`
     - `SPRING_DATASOURCE_PASSWORD`
  4. Verified data via `psql` (`\dt`, `SELECT COUNT(*) FROM products;`) and by hitting APIs like `/api/products` and `/api/users`.

for more detailed info - [Click here to view db-migration file]()

---

## Backend – Dockerized Spring Boot Service

The backend runs as a **Dockerized Spring Boot service** on Render, using a **multi-stage Dockerfile**:

- **Stage 1 – Build (eclipse-temurin:21-jdk-jammy)**
  - Uses the official **Eclipse Temurin JDK 21** image to compile the app.
  - Copies Maven wrapper (`mvnw`) and `.mvn` config for dependency caching.
  - Runs:
    - `./mvnw dependency:go-offline` to prefetch dependencies.
    - `./mvnw clean package -DskipTests` to build the JAR (tests skipped to speed up CI builds).
  - Output: a fat JAR in `/app/target/*.jar`.

- **Stage 2 – Runtime (eclipse-temurin:21-jre-jammy)**
  - Uses the **JRE 21** image for a smaller, production-oriented container.
  - Sets `WORKDIR /app`.
  - `EXPOSE 10000` because Render expects the app to listen on **port 10000**.
  - Copies the built JAR from the build stage:
    - `COPY --from=build /app/target/*.jar app.jar`
  - Starts the app with Java preview features enabled:
    ```dockerfile
    ENTRYPOINT ["java", "-jar", "--enable-preview", "/app/app.jar"]
    ```

This setup gives a clean separation between **build** and **runtime**, smaller images, and a reproducible deployment.

---

## Frontend – Vite + React + Chakra UI

- Frontend is created using **Vite** (a fast build tool and dev server for React).
- Uses **React Router** for client-side routing (`/`, `/cart`, `/wishlist`, `/orders`, `/profile`, `/admin`, etc.).
- Uses **Chakra UI** for ready-made, accessible React UI components.
- The frontend is deployed as a **Render Static Site**:
  - `VITE_API_BASE_URL` is set to the backend’s Render URL.
  - All API calls go through this base URL, e.g. `VITE_API_BASE_URL/api/products`.

---

## Upcoming Changes

1. **Product Images**
   - Currently all product images are hardcoded to:
     ```text
     /src/resources/static/img/default-product.png
     ```
   - Plan:
     - Add per-product image URLs in the database.
     - Replace the hardcoded default path with dynamic URLs from DB.
     - Potentially integrate an external image hosting / storage (e.g. S3, Cloudinary) instead of serving all images from the JAR.

2. **(Future ideas you can add later)**
   - Add proper JWT-based authentication/authorization for admin routes.
   - Implement pagination and filtering at the backend level for products.
   - Add order history emails or notifications.
   - Improve error handling and user feedback for API failures (especially around cold starts on free tier).

---
