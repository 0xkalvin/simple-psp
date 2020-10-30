resource "aws_cloudwatch_log_group" "server_log_group" {
  name              = "/fargate-container/${var.project}-server-${terraform.workspace}"
  retention_in_days = "7"
}

resource "aws_cloudwatch_log_group" "worker_log_group" {
  name              = "/fargate-container/${var.project}-worker-${terraform.workspace}"
  retention_in_days = "7"
}
