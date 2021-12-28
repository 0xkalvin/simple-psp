resource "aws_cloudwatch_log_group" "server_log_group" {
  name              = "/ecs/${local.server_name}"
  retention_in_days = "7"
  tags              = local.tags
}

resource "aws_cloudwatch_log_group" "worker_log_group" {
  name              = "/ecs/${local.worker_name}"
  retention_in_days = "7"
  tags              = local.tags
}
