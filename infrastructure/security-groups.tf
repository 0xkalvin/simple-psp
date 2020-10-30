resource "aws_security_group" "load_balancer_security_group" {
  name        = "$${var.project}-${terraform.workspace}-sg"
  description = "controls access to the Application Load Balancer (ALB)"

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "server_task_security_group" {
  name        = "${var.project}-${terraform.workspace}-server-sg"
  description = "allow inbound access from the ALB only"

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "allow_database_access_for_server_task" {
  type        = "ingress"
  from_port   = "${module.database.port}"
  to_port     = "${module.database.port}"
  protocol    = "tcp"
  description = "Allow inbound RDS Postgres from ${var.project}-${terraform.workspace}"

  source_security_group_id = "${aws_security_group.server_task_security_group.id}"

  security_group_id = "${module.database.security_group_id}"
}
