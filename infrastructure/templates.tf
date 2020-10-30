data "template_file" "port_mappings" {
  template = "${file("templates/port-mappings.tpl")}"

  vars {
    containerPort = "3000"
    protocol      = "tcp"
  }
}

data "template_file" "server_environment" {
  template = "${file("templates/server-environment.tpl")}"

  vars {
    NODE_ENV        = "production"
    PORT            = "3000"
    APP_TYPE        = "server"
    DATABASE_HOST   = "${module.database.address}"
    DATABASE_PORT   = "${module.database.port}"
    DATABASE_NAME   = "${module.database.name}"
    DATABASE_USER   = "${module.database.username}"
    SQS_ENDPOINT    = "https://sqs.${data.aws_region.current.name}.amazonaws.com/${data.aws_caller_identity.current.account_id}"
    SQS_REGION      = "${data.aws_region.current.name}"
    SQS_CONCURRENCY = "10"
    PAYABLES_QUEUE  = "${local.payables_sqs_queue_name}"
  }
}

data "template_file" "worker_environment" {
  template = "${file("templates/worker-environment.tpl")}"

  vars {
    NODE_ENV        = "production"
    APP_TYPE        = "worker"
    DATABASE_HOST   = "${module.database.address}"
    DATABASE_PORT   = "${module.database.port}"
    DATABASE_NAME   = "${module.database.name}"
    DATABASE_USER   = "${module.database.username}"
    SQS_ENDPOINT    = "https://sqs.${data.aws_region.current.name}.amazonaws.com/${data.aws_caller_identity.current.account_id}"
    SQS_REGION      = "${data.aws_region.current.name}"
    SQS_CONCURRENCY = "10"
    PAYABLES_QUEUE  = "${local.payables_sqs_queue_name}"
  }
}

data "template_file" "base_secrets" {
  template = "${file("templates/secrets.tpl")}"

  vars {
    DATABASE_PASSWORD = "${aws_ssm_parameter.database_password.arn}"
  }
}
