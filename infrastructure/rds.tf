
resource "aws_security_group" "rds_instance_security_group" {
  name        = local.rds_name
  description = "Security group for RDS instance"

  vpc_id = local.vpc_id
}

resource "aws_security_group_rule" "allow_all_outbound" {
  type        = "egress"
  from_port   = 0
  to_port     = 65535
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = aws_security_group.rds_instance_security_group.id
}

resource "aws_security_group_rule" "allow_database_access_for_server_task" {
  type        = "ingress"
  from_port   = aws_db_instance.rds_instance.port
  to_port     = aws_db_instance.rds_instance.port
  protocol    = "tcp"
  description = "Allow inbound RDS Postgres from ${var.project}-${terraform.workspace}"

  source_security_group_id = aws_security_group.server_task_security_group.id

  security_group_id = aws_security_group.rds_instance_security_group.id
}

resource "aws_db_subnet_group" "subnet_group" {
  name        = local.rds_name
  description = "Subnet Group for ${local.rds_name} instance"
  subnet_ids  = local.subnet_ids

  tags = local.tags
}

resource "aws_db_instance" "rds_instance" {
  allocated_storage    = 10
  db_subnet_group_name = aws_db_subnet_group.subnet_group.name
  engine               = "postgres"
  engine_version       = "12.8"
  instance_class       = "db.t2.micro"
  multi_az             = false
  name                 = local.rds_name
  identifier           = local.rds_name
  password             = "REDACTED"
  port                 = "5432"
  publicly_accessible  = false
  username             = "${var.project}${terraform.workspace}"
  skip_final_snapshot  = true
  vpc_security_group_ids = [
    aws_security_group.rds_instance_security_group.id
  ]

  provisioner "local-exec" {
    command = "${path.module}/rds-password.sh ${var.aws_region} ${self.id} /${local.rds_name}/database_password"
  }
}
