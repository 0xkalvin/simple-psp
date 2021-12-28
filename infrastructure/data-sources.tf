data "aws_vpc" "default_vpc" {
  default = true
}

data "aws_subnet_ids" "subnets_from_default_vpc" {
  vpc_id = data.aws_vpc.default_vpc.id
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}
