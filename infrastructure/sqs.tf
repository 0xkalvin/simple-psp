resource "aws_sqs_queue" "payables_creation_queue" {
  delay_seconds               = 0
  message_retention_seconds   = 345600
  max_message_size            = 262144
  name                        = local.payables_creation_queue
  receive_wait_time_seconds   = 0
  visibility_timeout_seconds  = 30
  fifo_queue                  = true
  content_based_deduplication = true
}

resource "aws_sqs_queue" "payables_settlement_queue" {
  delay_seconds               = 0
  message_retention_seconds   = 345600
  max_message_size            = 262144
  name                        = local.payables_settlement_queue
  receive_wait_time_seconds   = 0
  visibility_timeout_seconds  = 30
  fifo_queue                  = true
  content_based_deduplication = true
}

resource "aws_sqs_queue" "transactions_settlement_queue" {
  delay_seconds               = 0
  message_retention_seconds   = 345600
  max_message_size            = 262144
  name                        = local.transactions_settlement_queue
  receive_wait_time_seconds   = 0
  visibility_timeout_seconds  = 30
  fifo_queue                  = true
  content_based_deduplication = true
}
