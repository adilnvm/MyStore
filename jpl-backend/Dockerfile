# --- Stage 1: Build Stage (Uses Temurin JDK for compilation) ---
# Temurin images are highly reliable and widely used in production
FROM eclipse-temurin:21-jdk-jammy AS build
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

# --- Stage 2: Runtime Stage (Temurin JRE for minimal size/security) ---
# Switch to the JRE version for the final, smallest image
FROM eclipse-temurin:21-jre-jammy  <-- THIS IS THE NEW RELIABLE JRE TAG
WORKDIR /app

# Render listens on PORT 10000
EXPOSE 10000

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Run the app with the necessary --enable-preview flag
# This flag is CRUCIAL for your compiled code
ENTRYPOINT ["java", "-jar", "--enable-preview", "/app.jar"]