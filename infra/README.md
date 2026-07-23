# Infraestrutura — EduAlerta

Este diretório contém a infraestrutura como código (Terraform), manifests Kubernetes
e stack de monitoramento complementares à aplicação Spring Boot.

## Arquitetura AWS provisionada pelo Terraform

```
                         Internet
                            |
                      Internet Gateway
                            |
                    ┌───────────────┐
                    │  ALB (público) │  ← Security Group: 80/443 da internet
                    └───────┬───────┘
                            |
        ┌───────────────────────────────────┐
        │        Subnets PRIVADAS            │
        │                                     │
        │   ECS Fargate (tasks)               │
        │   Security Group: só recebe do ALB  │
        │                                     │
        │              |                      │
        │        RDS PostgreSQL               │
        │   Security Group: só recebe da app  │
        └───────────────────────────────────┘
                            |
                      NAT Gateway  → internet (pull de imagem, etc.)
```

## Arquivos

| Arquivo | O que provisiona |
|---|---|
| `main.tf` | Provider AWS, versão do Terraform, backend (comentado) |
| `variables.tf` | Todas as variáveis parametrizáveis |
| `vpc.tf` | VPC, subnets públicas/privadas, IGW, NAT, route tables, Security Groups |
| `ecs.tf` | ALB, ECS Cluster/Task/Service, IAM roles, CloudWatch Logs, SSM Parameters |
| `rds.tf` | Instância PostgreSQL em subnet privada |
| `outputs.tf` | DNS do ALB, endpoint do RDS, IDs da VPC/subnets |

## Como usar

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# edite terraform.tfvars com seus valores

export TF_VAR_db_password="sua-senha-forte"

terraform init
terraform plan     # revisa o que será criado — não aplica nada
terraform apply     # aplica de verdade (gera custo na AWS!)
terraform destroy   # remove tudo quando terminar de testar
```

> ⚠️ Isso cria recursos reais na AWS (ALB, NAT Gateway e RDS **não** são gratuitos
> no free tier). Rode `terraform plan` para estudar e mostrar na entrevista;
> só rode `apply` se quiser validar de ponta a ponta e lembrar de dar `destroy` depois.

## Kubernetes (`k8s/`)

Manifests simples de Deployment + Service + Ingress, alternativa ao ECS caso
queira demonstrar conhecimento em Kubernetes puro.

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Monitoramento (`monitoring/`)

Prometheus + Grafana rodando localmente via Docker Compose, coletando métricas
do Actuator. Veja `monitoring/HABILITAR_PROMETHEUS.md` para o passo a passo.

## CI/CD (`ci.yml`)

Substitui/estende o workflow atual, adicionando:
- Testes automatizados (Maven)
- Build da imagem Docker
- **Scan de vulnerabilidades com Trivy**
- `terraform fmt` / `validate` em todo PR
- Job de deploy comentado, pronto para habilitar

Copie o conteúdo de `ci.yml` para `.github/workflows/ci.yml` no repositório principal.

## Perguntas que essa estrutura ajuda a responder na entrevista

- **"Como você organizaria uma VPC?"** → 2 subnets públicas (ALB/NAT) + 2 privadas
  (app/banco), replicadas em 2 AZs para alta disponibilidade.
- **"Diferença entre Security Group e NACL?"** → SG é stateful e por recurso
  (aqui: um SG por camada — ALB, app, banco); NACL é stateless e por subnet.
- **"Como a app privada acessa a internet pra baixar a imagem?"** → NAT Gateway
  na subnet pública, referenciado pela route table da subnet privada.
- **"Como você gerencia secrets?"** → SSM Parameter Store (SecureString),
  injetado como variável de ambiente na task definition do ECS.
