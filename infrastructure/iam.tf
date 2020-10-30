data "aws_iam_policy_document" "server_task_policy_document" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "server_task_iam_role" {
  name               = "${var.project}-${terraform.workspace}-task-role"
  assume_role_policy = "${data.aws_iam_policy_document.server_task_policy_document.json}"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = "${aws_iam_role.server_task_iam_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "sqs_ssm_iam_policy_document" {
  statement {
    actions = [
      "sqs:SendMessage",
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
    ]

    resources = [
      "${module.payables_sqs_queue.arn}",
    ]
  }

  statement {
    actions = [
      "ssm:GetParameters",
      "ssm:GetParameter",
      "ssm:DescribeParameters",
    ]

    "resources" = [
      "arn:aws:ssm:${var.region}:*:parameter/${var.project}*",
    ]
  }
}

resource "aws_iam_policy" "sqs_iam_policy" {
  name        = "${var.project}-sqs-${terraform.workspace}"
  description = "SQS Access Policy ${var.project} at ${terraform.workspace}"
  policy      = "${data.aws_iam_policy_document.sqs_ssm_iam_policy_document.json}"
}

resource "aws_iam_role_policy_attachment" "sqs_iam_role_policy_attachment" {
  role       = "${aws_iam_role.server_task_iam_role.name}"
  policy_arn = "${aws_iam_policy.sqs_iam_policy.arn}"
}
