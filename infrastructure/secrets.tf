resource "aws_ssm_parameter" "database_password" {
  name  = "/${var.project}${terraform.env}/database_password"
  type  = "SecureString"
  value = "REDACTED"

  tags = {
    name = "${var.project}"
  }

  lifecycle {
    ignore_changes = [
      "value",
    ]
  }
}
