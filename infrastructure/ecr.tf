module "ecr" {
  source = "github.com/0xkalvin/terraform-modules//ecr"
  name   = "${var.project}-${terraform.workspace}"
}
