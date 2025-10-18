# --- Stage 1: Build Stage (Uses a large JDK 21 to compile) ---
FROM openjdk:21-jdk-slim AS build
WORKDIR /app

# Copy the dependency file (pom.xml or build.gradle) first for caching
# (Assuming you are using Maven, based on the previous plan context)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src /app/src

# Compile the application and create the executable JAR, skipping tests
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Runtime Stage (Uses a minimal JRE 21 to run) ---
# Use a minimal JRE 21 for security and size reduction
FROM openjdk:21-jre-slim

# The Render Web Service listens on PORT 10000 by default
EXPOSE 10000

# Copy ONLY the final executable JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Command to start the application (must run on port 10000)
ENTRYPOINT ["java", "-jar", "/app.jar"]