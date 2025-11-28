# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build

# Build arguments
ARG BUILD_DATE
ARG VERSION

WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy only main source code (not tests)
COPY src/main ./src/main
RUN mvn clean package -DskipTests -q

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Metadata labels
LABEL maintainer="Price Wise Team"
LABEL version="${VERSION:-1.0.0}"
LABEL description="Price Wise Backend - Spring Boot REST API"
LABEL build-date="${BUILD_DATE}"

WORKDIR /app

# Install wget for healthcheck and create non-root user
RUN apk add --no-cache wget curl && \
    addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser && \
    chown -R appuser:appuser /app

# Copy jar from build stage
COPY --from=build --chown=appuser:appuser /app/target/*.jar app.jar

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run application with optimized JVM settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
