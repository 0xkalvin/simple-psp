resource "aws_lb" "load_balancer" {
  name     = "lb-${var.project}-${terraform.workspace}"
  internal = false

  subnets = ["${data.aws_subnet_ids.subnets_from_default_vpc.ids}"]

  load_balancer_type = "application"
  security_groups    = ["${aws_security_group.load_balancer_security_group.id}"]

  tags = {
    Environment = "${terraform.workspace}"
    Application = "${var.project}"
  }
}

resource "aws_lb_listener" "http_forward" {
  load_balancer_arn = "${aws_lb.load_balancer.arn}"
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.load_balancer_target_group.arn}"
  }
}

resource "aws_lb_target_group" "load_balancer_target_group" {
  name        = "lb-${var.project}-${terraform.workspace}-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = "${data.aws_vpc.default_vpc.id}"
  target_type = "ip"

  health_check {
    matcher = "200-299"
    path    = "/"
  }
}
