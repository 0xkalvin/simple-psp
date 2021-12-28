resource "aws_security_group" "server_task_security_group" {
  name        = "${var.project}-${terraform.workspace}-server-sg"
  description = "Security group for the server ECS task"

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    security_groups = [
      aws_security_group.load_balancer_security_group.id
    ]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "ecs_service_server" {
  name            = local.server_name
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.task_definition_server.arn
  desired_count   = 0
  launch_type     = "FARGATE"

  network_configuration {
    subnets = local.subnet_ids
    security_groups = [
      aws_security_group.server_task_security_group.id
    ]
    assign_public_ip = true // For simplicity, we're using the default VPC. Don't do that in a real project.
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.load_balancer_target_group.arn
    container_name   = local.server_name
    container_port   = local.server_port
  }

  lifecycle {
    ignore_changes = [
      desired_count,
      task_definition,
    ]
  }

  tags = local.tags
}

resource "aws_ecs_service" "ecs_service_worker" {
  name            = local.worker_name
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.task_definition_worker.arn
  desired_count   = 0
  launch_type     = "FARGATE"

  network_configuration {
    subnets = local.subnet_ids
    security_groups = [
      aws_security_group.server_task_security_group.id
    ]
    assign_public_ip = true // For simplicity, we're using the default VPC. Don't do that in a real project.
  }

  lifecycle {
    ignore_changes = [
      desired_count,
      task_definition,
    ]
  }

  tags = local.tags
}
