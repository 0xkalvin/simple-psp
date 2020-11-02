module "database" {
  source            = "github.com/0xkalvin/terraform-modules//rds"
  allocated_storage = 10
  environment       = "${terraform.workspace}"
  name              = "${var.project}${terraform.workspace}"
  username          = "${var.project}${terraform.workspace}"
  vpc_id            = "${data.aws_vpc.default_vpc.id}"
  subnets_ids        = "${data.aws_subnet_ids.subnets_from_default_vpc.ids}"
  region            = "${var.region}"
}
