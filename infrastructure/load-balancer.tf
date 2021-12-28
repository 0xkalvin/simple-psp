resource "aws_security_group" "load_balancer_security_group" {
  name        = "${var.project}-${terraform.workspace}-lb-sg"
  description = "Security group for the ${var.project} load balancer"

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

resource "aws_lb" "load_balancer" {
  name     = "lb-${var.project}-${terraform.workspace}"
  internal = false

  subnets = local.subnet_ids


  load_balancer_type = "application"
  security_groups = [
    aws_security_group.load_balancer_security_group.id
  ]

  tags = local.tags
}

resource "aws_lb_listener" "http_forward" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.load_balancer_target_group.arn
  }
}

resource "aws_lb_target_group" "load_balancer_target_group" {
  name        = "lb-${var.project}-${terraform.workspace}-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = local.vpc_id
  target_type = "ip"

  health_check {
    matcher = "200-299"
    path    = "/_liveness_check_"
  }
}
