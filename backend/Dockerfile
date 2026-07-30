FROM maven:3.9.10-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src src
RUN mvn -B -q clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN apt-get update     && apt-get install -y --no-install-recommends curl     && rm -rf /var/lib/apt/lists/*     && useradd --system --uid 10001 valtieris
COPY --from=build /workspace/target/valtieris-marketing-backend-1.1.0.jar app.jar
USER valtieris
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3   CMD curl -fsS http://127.0.0.1:8081/actuator/health >/dev/null || exit 1
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
