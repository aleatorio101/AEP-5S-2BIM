variable "aws_region" {
  description = "Região AWS onde a infraestrutura será provisionada"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto, usado como prefixo em todos os recursos"
  type        = string
  default     = "edualerta"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block da VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDRs das subnets públicas (uma por AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDRs das subnets privadas (uma por AZ)"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "availability_zones" {
  description = "AZs usadas para distribuir as subnets"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "container_image" {
  description = "Imagem Docker publicada no GHCR (ex: ghcr.io/aleatorio101/edualerta:latest)"
  type        = string
  default     = "ghcr.io/aleatorio101/edualerta:latest"
}

variable "container_port" {
  description = "Porta exposta pela aplicação Spring Boot"
  type        = number
  default     = 8080
}

variable "task_cpu" {
  description = "CPU units da task Fargate (256 = 0.25 vCPU)"
  type        = string
  default     = "256"
}

variable "task_memory" {
  description = "Memória da task Fargate em MB"
  type        = string
  default     = "512"
}

variable "desired_count" {
  description = "Número de tasks/réplicas do serviço ECS"
  type        = number
  default     = 1
}

variable "db_name" {
  description = "Nome do banco de dados PostgreSQL"
  type        = string
  default     = "edualerta"
}

variable "db_username" {
  description = "Usuário administrador do RDS"
  type        = string
  default     = "edualerta"
  sensitive   = true
}

variable "db_password" {
  description = "Senha do RDS (nunca commitar valor real — passar via terraform.tfvars ou variável de ambiente TF_VAR_db_password)"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "Classe da instância RDS"
  type        = string
  default     = "db.t3.micro"
}
