resource "aws_ecs_task_definition" "task_definition_server" {
  family                   = local.server_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.server_task_iam_role.arn
  task_role_arn            = aws_iam_role.server_task_iam_role.arn
  cpu = local.server_cpu
  memory = local.server_memory
  container_definitions = jsonencode(
    [
      {
        name : local.server_name,
        image : "${aws_ecr_repository.ecr_repo.repository_url}:latest",
        cpu : local.server_cpu,
        memory : local.server_memory,
        environment : [
          {
            name  = "NODE_ENV"
            value = "production"
          },
          {
            name  = "PORT"
            value = "3000"
          },
          {
            name  = "DATABASE_HOST"
            value = aws_db_instance.rds_instance.address
          },
          {
            name  = "DATABASE_PORT"
            value = "${tostring(aws_db_instance.rds_instance.port)}"
          },
          {
            name  = "DATABASE_NAME"
            value = aws_db_instance.rds_instance.name
          },
          {
            name  = "DATABASE_USER"
            value = aws_db_instance.rds_instance.username
          },
          {
            name  = "DATABASE_MAX_CONNECTIONS"
            value = "100"
          },
          {
            name  = "SQS_ENDPOINT"
            value = local.sqs_endpoint
          },
          {
            name  = "SQS_REGION"
            value = data.aws_region.current.name
          },
          {
            name  = "SQS_CONCURRENCY"
            value = "10"
          },
          {
            name  = "SQS_MAX_RETRIES"
            value = "3"
          },
          {
            name  = "SQS_PAYABLES_CREATION_QUEUE_URL"
            value = aws_sqs_queue.payables_creation_queue.url
          },
          {
            name  = "SQS_PAYABLES_SETTLEMENT_QUEUE_URL"
            value = aws_sqs_queue.payables_settlement_queue.url
          },
          {
            name  = "SQS_TRANSACTIONS_SETTLEMENT_QUEUE_URL"
            value = aws_sqs_queue.transactions_settlement_queue.url
          },
          {
            name  = "APP_NAME"
            value = "rest_server"
          },
          {
            name = "LOG_LEVEL"
            value = "debug"
          }
        ],
        secrets : [
          {
            name  = "DATABASE_PASSWORD"
            valueFrom = aws_ssm_parameter.database_password.arn
          }
        ],
        essential : true,
        portMappings : [
          {
            containerPort : local.server_port,
            protocol : "tcp"
          }
        ],
        logConfiguration : {
          logDriver : "awslogs",
          options : {
            awslogs-group : "/ecs/${local.server_name}",
            awslogs-region : "${var.aws_region}",
            awslogs-stream-prefix : "ecs"
          }
        }
      }
    ]
  )
  tags = local.tags
}

resource "aws_ecs_task_definition" "task_definition_worker" {
  family                   = local.worker_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.server_task_iam_role.arn
  task_role_arn            = aws_iam_role.server_task_iam_role.arn
  cpu = local.server_cpu
  memory = local.server_memory
  container_definitions = jsonencode(
    [
      {
        name : local.worker_name,
        image : "${aws_ecr_repository.ecr_repo.repository_url}:latest",
        cpu : local.worker_cpu,
        memory : local.worker_memory,
        environment : [
          {
            name  = "NODE_ENV"
            value = "production"
          },
          {
            name  = "DATABASE_HOST"
            value = aws_db_instance.rds_instance.address
          },
          {
            name  = "DATABASE_PORT"
            value = "${tostring(aws_db_instance.rds_instance.port)}"
          },
          {
            name  = "DATABASE_NAME"
            value = aws_db_instance.rds_instance.name
          },
          {
            name  = "DATABASE_USER"
            value = aws_db_instance.rds_instance.username
          },
          {
            name  = "DATABASE_MAX_CONNECTIONS"
            value = "100"
          },
          {
            name  = "SQS_ENDPOINT"
            value = local.sqs_endpoint
          },
          {
            name  = "SQS_REGION"
            value = data.aws_region.current.name
          },
          {
            name  = "SQS_CONCURRENCY"
            value = "10"
          },
          {
            name  = "SQS_MAX_RETRIES"
            value = "3"
          },
          {
            name  = "SQS_PAYABLES_CREATION_QUEUE_URL"
            value = aws_sqs_queue.payables_creation_queue.url
          },
          {
            name  = "SQS_PAYABLES_SETTLEMENT_QUEUE_URL"
            value = aws_sqs_queue.payables_settlement_queue.url
          },
          {
            name  = "SQS_TRANSACTIONS_SETTLEMENT_QUEUE_URL"
            value = aws_sqs_queue.transactions_settlement_queue.url
          },
          {
            name  = "APP_NAME"
            value = "sqs_workers"
          },
          {
            name = "LOG_LEVEL"
            value = "debug"
          }
        ],
        secrets : [
          {
            name  = "DATABASE_PASSWORD"
            valueFrom = aws_ssm_parameter.database_password.arn
          }
        ],
        essential : true,
        logConfiguration : {
          logDriver : "awslogs",
          options : {
            awslogs-group : "/ecs/${local.worker_name}",
            awslogs-region : "${var.aws_region}",
            awslogs-stream-prefix : "ecs"
          }
        }
      }
    ]
  )
  tags = local.tags
}
