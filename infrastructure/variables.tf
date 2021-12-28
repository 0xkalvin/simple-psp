variable "profile" {
  default = "default"
}

variable "aws_region" {
  default = "us-east-1"
}

variable "project" {
  type = string
}

variable "cw_alarm_actions" {
  default = []
}

variable "cw_insufficient_data_actions" {
  default = []
}

variable "cw_ok_actions" {
  default = []
}
