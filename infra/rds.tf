# ─── Subnet group (RDS precisa de subnets privadas em 2+ AZs) ─────────────
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# ─── Instância RDS PostgreSQL ──────────────────────────────────────────────
resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.db_instance_class

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]

  multi_az                = false # true em produção para HA
  publicly_accessible     = false
  backup_retention_period = 7
  skip_final_snapshot     = true # false em produção

  tags = {
    Name = "${var.project_name}-db"
  }
}
