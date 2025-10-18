# --- Stage 1: Build Stage ---
FROM openjdk:21-jdk-slim-bullseye AS build
WORKDIR /app

# Copy Maven wrapper and pom.xml first for dependency caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of the source
COPY src ./src

# Build the app (skip tests to speed up)
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Runtime Stage ---
FROM openjdk:21-jdk-slim-bullseye
WORKDIR /app

# The Render Web Service listens on PORT 10000 by default
EXPOSE 10000

# Copy the JAR built in the first stage
COPY --from=build /app/target/*.jar app.jar

# Run the app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
