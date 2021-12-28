resource "aws_cloudwatch_metric_alarm" "server_MemoryUtilization" {
  alarm_name                = "${var.project}-server-${terraform.workspace}-MemoryUtilization"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  metric_name               = "MemoryUtilization"
  namespace                 = "AWS/ECS"
  statistic                 = "Average"
  treat_missing_data        = "notBreaching"
  alarm_description         = "Memory utilization for the ${var.project}-server averaged 80% or more."
  actions_enabled           = "true"
  alarm_actions             = var.cw_alarm_actions
  datapoints_to_alarm       = 3
  evaluation_periods        = 5 // minutes
  insufficient_data_actions = var.cw_insufficient_data_actions
  ok_actions                = var.cw_ok_actions
  period                    = 60 // 1 minute
  tags                      = local.tags
  threshold                 = 80
  dimensions = {
    ServiceName = aws_ecs_service.ecs_service_server.name
    ClusterName = local.ecs_cluster_name
  }
}

resource "aws_cloudwatch_metric_alarm" "worker_MemoryUtilization" {
  alarm_name                = "${var.project}-worker-${terraform.workspace}-MemoryUtilization"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  metric_name               = "MemoryUtilization"
  namespace                 = "AWS/ECS"
  statistic                 = "Average"
  treat_missing_data        = "notBreaching"
  alarm_description         = "Memory utilization for the ${var.project}-worker averaged 80% or more."
  actions_enabled           = "true"
  alarm_actions             = var.cw_alarm_actions
  datapoints_to_alarm       = 3
  evaluation_periods        = 5 // minutes
  insufficient_data_actions = var.cw_insufficient_data_actions
  ok_actions                = var.cw_ok_actions
  period                    = 60 // 1 minute
  tags                      = local.tags
  threshold                 = 80
  dimensions = {
    ServiceName = aws_ecs_service.ecs_service_worker.name
    ClusterName = local.ecs_cluster_name
  }
}

resource "aws_cloudwatch_metric_alarm" "server_CPUUtilization" {
  alarm_name                = "${var.project}-server-${terraform.workspace}-CPUUtilization"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  statistic                 = "Average"
  alarm_description         = "CPU utilization for the ${var.project}-server averaged 80% or more."
  treat_missing_data        = "notBreaching"
  actions_enabled           = "true"
  alarm_actions             = var.cw_alarm_actions
  datapoints_to_alarm       = 3
  evaluation_periods        = 5 // minutes
  insufficient_data_actions = var.cw_insufficient_data_actions
  ok_actions                = var.cw_ok_actions
  period                    = 60 // 1 minute
  tags                      = local.tags
  threshold                 = 80

  dimensions = {
    ServiceName = aws_ecs_service.ecs_service_server.name
    ClusterName = local.ecs_cluster_name
  }
}

resource "aws_cloudwatch_metric_alarm" "worker_CPUUtilization" {
  alarm_name                = "${var.project}-worker-${terraform.workspace}-CPUUtilization"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  statistic                 = "Average"
  alarm_description         = "CPU utilization for the ${var.project}-worker averaged 80% or more."
  treat_missing_data        = "notBreaching"
  actions_enabled           = "true"
  alarm_actions             = var.cw_alarm_actions
  datapoints_to_alarm       = 3
  evaluation_periods        = 5 // minutes
  insufficient_data_actions = var.cw_insufficient_data_actions
  ok_actions                = var.cw_ok_actions
  period                    = 60 // 1 minute
  tags                      = local.tags
  threshold                 = 80

  dimensions = {
    ServiceName = aws_ecs_service.ecs_service_worker.name
    ClusterName = local.ecs_cluster_name
  }
}


resource "aws_cloudwatch_metric_alarm" "server_HTTPCode_Target_5XX_Count" {
  alarm_name                = "${var.project}-server-${terraform.workspace}-HTTPCode_Target_5XX_Count"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  metric_name               = "HTTPCode_Target_5XX_Count"
  namespace                 = "AWS/ApplicationELB"
  statistic                 = "Sum"
  alarm_description         = "Elevated 5xx errors originating from ${var.project}-server target group."
  actions_enabled           = "true"
  treat_missing_data        = "notBreaching"
  alarm_actions             = var.cw_alarm_actions
  datapoints_to_alarm       = 2
  evaluation_periods        = 3 // minutes
  insufficient_data_actions = var.cw_insufficient_data_actions
  ok_actions                = var.cw_ok_actions
  period                    = 60 // 1 minute
  tags                      = local.tags
  threshold                 = 50 // count

  dimensions = {
    LoadBalancer = aws_lb.load_balancer.arn_suffix
    TargetGroup  = aws_lb_target_group.load_balancer_target_group.arn_suffix
  }
}

resource "aws_cloudwatch_metric_alarm" "server_HTTPCode_Target_4XX_Count" {
  alarm_name                = "${var.project}-server-${terraform.workspace}-HTTPCode_Target_4XX_Count"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  metric_name               = "HTTPCode_Target_4XX_Count"
  namespace                 = "AWS/ApplicationELB"
  statistic                 = "Sum"
  alarm_description         = "Elevated 4xx errors originating from ${var.project}-server target group."
  actions_enabled           = "true"
  treat_missing_data        = "notBreaching"
  alarm_actions             = var.cw_alarm_actions
  datapoints_to_alarm       = 3
  evaluation_periods        = 5 // minutes
  insufficient_data_actions = var.cw_insufficient_data_actions
  ok_actions                = var.cw_ok_actions
  period                    = 60 // 1 minute
  tags                      = local.tags
  threshold                 = 100 // count

  dimensions = {
    LoadBalancer = aws_lb.load_balancer.arn_suffix
    TargetGroup  = aws_lb_target_group.load_balancer_target_group.arn_suffix
  }
}

resource "aws_cloudwatch_metric_alarm" "server_p95_TargetResponseTime" {
  alarm_name                = "${var.project}-server-${terraform.workspace}-p95_TargetResponseTime"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  metric_name               = "TargetResponseTime"
  namespace                 = "AWS/ApplicationELB"
  extended_statistic        = "p95"
  alarm_description         = "p95 latency over 2s for ${var.project}-server target group."
  actions_enabled           = "true"
  treat_missing_data        = "notBreaching"
  alarm_actions             = var.cw_alarm_actions
  datapoints_to_alarm       = 3
  evaluation_periods        = 5 // minutes
  insufficient_data_actions = var.cw_insufficient_data_actions
  ok_actions                = var.cw_ok_actions
  period                    = 60 // 1 minute
  tags                      = local.tags
  threshold                 = 1 // minute

  dimensions = {
    LoadBalancer = aws_lb.load_balancer.arn_suffix
    TargetGroup  = aws_lb_target_group.load_balancer_target_group.arn_suffix
  }
}

resource "aws_cloudwatch_metric_alarm" "server_success_rate_low" {
  alarm_name                = "${var.project}-server-${terraform.workspace}-success-rate"
  alarm_description         = "Success rate is lower than 95% for ${var.project}-server."
  comparison_operator       = "LessThanOrEqualToThreshold"
  actions_enabled           = "true"
  treat_missing_data        = "notBreaching"
  alarm_actions             = var.cw_alarm_actions
  datapoints_to_alarm       = 3
  evaluation_periods        = 5 // minutes
  insufficient_data_actions = var.cw_insufficient_data_actions
  ok_actions                = var.cw_ok_actions
  tags                      = local.tags
  threshold                 = 95 // percentage

  metric_query {
    id    = "m1"
    label = "Target group 2xx Count"

    metric {
      namespace   = "AWS/ApplicationELB"
      metric_name = "HTTPCode_Target_2XX_Count"
      period      = "60"
      stat        = "Sum"

      dimensions = {
        LoadBalancer = aws_lb.load_balancer.arn_suffix
        TargetGroup  = aws_lb_target_group.load_balancer_target_group.arn_suffix
      }
    }
  }

  metric_query {
    id    = "m2"
    label = "Target group 4xx Count"

    metric {
      namespace   = "AWS/ApplicationELB"
      metric_name = "HTTPCode_Target_4XX_Count"
      period      = "60"
      stat        = "Sum"

      dimensions = {
        LoadBalancer = aws_lb.load_balancer.arn_suffix
        TargetGroup  = aws_lb_target_group.load_balancer_target_group.arn_suffix
      }
    }
  }

  metric_query {
    id    = "m3"
    label = "Target group 5xx Count"

    metric {
      namespace   = "AWS/ApplicationELB"
      metric_name = "HTTPCode_Target_5XX_Count"
      period      = "60"
      stat        = "Sum"

      dimensions = {
        LoadBalancer = aws_lb.load_balancer.arn_suffix
        TargetGroup  = aws_lb_target_group.load_balancer_target_group.arn_suffix
      }
    }
  }

  metric_query {
    id         = "m4"
    label      = "Target group requests sum"
    expression = "m1 + m2 + m3"
  }

  metric_query {
    id          = "m5"
    label       = "Success Rate"
    expression  = "m1 / m4 * 100"
    return_data = "true"
  }
}
