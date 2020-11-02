module "ecs_cluster" {
  source = "github.com/0xkalvin/terraform-modules//ecs-cluster"
  name   = "microservices-cluster-${terraform.workspace}"
}
