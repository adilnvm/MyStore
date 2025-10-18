# --- Stage 1: Build Stage (Uses a full JDK 21 to compile) ---
# NOTE: Using a slim build image that is known to exist
FROM openjdk:21-jdk-slim-bullseye AS build
WORKDIR /app

# Copy the dependency file (pom.xml) first for caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src /app/src

# Compile the application and create the executable JAR, skipping tests
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Runtime Stage (Uses a minimal JRE 21 to run) ---
# NOTE: Using a minimal JRE image that is known to exist
FROM openjdk:21-jre-slim-bullseye

# The Render Web Service listens on PORT 10000 by default
EXPOSE 10000

# Copy ONLY the final executable JAR file from the build stage
# Assuming the JAR name is derived from your pom.xml (e.g., jpl-backend.jar)
COPY --from=build /app/target/*.jar app.jar

# Command to start the application (must run on port 10000)
ENTRYPOINT ["java", "-jar", "/app.jar"]