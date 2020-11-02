variable "profile" {
  default = "default"
}

variable "region" {
  default = "us-east-1"
}

variable "project" {
  type = "string"
}

variable "environment_name" {
  type = "string"
}

variable "container_port" {
  default = 3000
}
