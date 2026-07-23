output "alb_dns_name" {
  description = "URL pública do Load Balancer para acessar a aplicação"
  value       = aws_lb.main.dns_name
}

output "ecs_cluster_name" {
  description = "Nome do cluster ECS"
  value       = aws_ecs_cluster.main.name
}

output "rds_endpoint" {
  description = "Endpoint do banco RDS (só acessível dentro da VPC)"
  value       = aws_db_instance.main.address
  sensitive   = true
}

output "vpc_id" {
  description = "ID da VPC criada"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}
