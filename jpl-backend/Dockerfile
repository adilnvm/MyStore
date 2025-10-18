# --- Stage 1: Build Stage ---
FROM openjdk:21-jdk-slim-bullseye AS build
WORKDIR /app

# Copy Maven wrapper and configuration first for dependency caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# ✅ Give execute permission to mvnw
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of the source
COPY src ./src

# Build the app (skip tests to speed up)
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Runtime Stage ---
FROM openjdk:21-jdk-slim-bullseye
WORKDIR /app

# Render listens on PORT 10000
EXPOSE 10000

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Run the app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
