# --- Stage 1: Build Stage ---
FROM openjdk:21-jdk-slim AS build
WORKDIR /app

# Copy Maven wrapper and configuration first for dependency caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission to mvnw
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of the source
COPY src ./src

# Build the app (skip tests to speed up)
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Runtime Stage (JRE for minimal size/security) ---
FROM openjdk:21-jre-bullseye
WORKDIR /app

# Render listens on PORT 10000
EXPOSE 10000

# Copy built JAR from build stage (renamed to app.jar in the current directory /app)
COPY --from=build /app/target/*.jar app.jar

# Run the app with the necessary --enable-preview flag
ENTRYPOINT ["java", "-jar", "--enable-preview", "/app.jar"]