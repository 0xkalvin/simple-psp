resource "aws_ssm_parameter" "database_password" {
  name  = "/${var.project}${terraform.workspace}/database_password"
  type  = "SecureString"
  value = "REDACTED"

  tags = local.tags

  lifecycle {
    ignore_changes = [
      value,
    ]
  }
}
