# Habilitar métricas Prometheus no EduAlerta

## 1. Adicionar dependência no `pom.xml`

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

## 2. Configurar no `application.yml` (ou `application.properties`)

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
  endpoint:
    health:
      show-details: always
      probes:
        enabled: true
  metrics:
    tags:
      application: edualerta
```

## 3. Testar localmente

```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up --build
```

- App: http://localhost:8080/actuator/prometheus
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (login: admin / admin)

No Grafana, adicione o Prometheus (`http://prometheus:9090`) como data source e importe o
dashboard **"JVM (Micrometer)" — ID 4701** na galeria pública do Grafana, pronto pra usar.

## Frase pra entrevista

"Exponho métricas da aplicação via Spring Boot Actuator + Micrometer, no formato do
Prometheus. O Prometheus faz scraping periódico desse endpoint e o Grafana consome
essas métricas para dashboards de CPU, memória, latência e taxa de erro."
