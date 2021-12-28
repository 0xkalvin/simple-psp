locals {
  ecs_cluster_name              = "microservices-${terraform.workspace}"
  payables_creation_queue       = "payables-creation-${terraform.workspace}.fifo"
  payables_settlement_queue     = "payables-settlement-${terraform.workspace}.fifo"
  transactions_settlement_queue = "transactions-settlement-${terraform.workspace}.fifo"
  server_cpu                    = 256
  server_memory                 = 1024
  server_name                   = "${var.project}-server-${terraform.workspace}"
  server_port                   = 3000
  worker_cpu                    = 256
  worker_memory                 = 1024
  worker_name                   = "${var.project}-worker-${terraform.workspace}"
  account_id                    = data.aws_caller_identity.current.account_id

  rds_name = "${var.project}${terraform.workspace}"

  vpc_id     = data.aws_vpc.default_vpc.id
  subnet_ids = tolist(data.aws_subnet_ids.subnets_from_default_vpc.ids)

  sqs_endpoint = "https://sqs.${data.aws_region.current.name}.amazonaws.com/${data.aws_caller_identity.current.account_id}"

  alarm_arn_prefix = "arn:aws:cloudwatch:${var.aws_region}:${local.account_id}:alarm:${var.project}"

  tags = {
    project = var.project
    env     = terraform.workspace
  }
}
