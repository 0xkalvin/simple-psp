module "payables_sqs_queue" {
  source                      = "github.com/0xkalvin/terraform-modules//sqs"
  name                        = "${local.payables_sqs_queue_name}"
  fifo_queue                  = true
  content_based_deduplication = true
}
