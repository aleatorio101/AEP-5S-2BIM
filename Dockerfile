# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Cache de dependências (só re-baixa se o pom.xml mudar)
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Copia o código e compila
COPY src ./src
RUN ./mvnw package -DskipTests -q

# Extrai layers do fat-jar para otimizar o cache de imagem
RUN java -Djarmode=layertools \
    -jar target/edualerta-*.jar extract --destination target/extracted


# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Usuário não-root por segurança
RUN addgroup -S edualerta && adduser -S edualerta -G edualerta
USER edualerta

# Copia as layers na ordem de menor → maior frequência de mudança
COPY --from=builder /build/target/extracted/dependencies/          ./
COPY --from=builder /build/target/extracted/spring-boot-loader/   ./
COPY --from=builder /build/target/extracted/snapshot-dependencies/ ./
COPY --from=builder /build/target/extracted/application/          ./

# Volume para evidências (arquivos anexados)
VOLUME ["/app/uploads"]

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "org.springframework.boot.loader.launch.JarLauncher"]
