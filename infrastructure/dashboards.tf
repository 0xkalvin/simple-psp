resource "aws_cloudwatch_dashboard" "simple_psp_dashboard" {
  dashboard_name = "${var.project}-${terraform.workspace}-dashboard"

  dashboard_body = jsonencode({
    "widgets" : [
      {
        "type" : "metric",
        "x" : 0,
        "y" : 0,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HTTPCode_Target_5XX_Count",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Target Group 5XX Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 0,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HTTPCode_Target_4XX_Count",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Target Group 4XX Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 6,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HTTPCode_Target_2XX_Count",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Target Group 2XX Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 6,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HTTPCode_Target_2XX_Count",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}",
              {
                "id" : "m1",
                "visible" : false
              }
            ],
            [
              "AWS/ApplicationELB",
              "HTTPCode_Target_4XX_Count",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}",
              {
                "id" : "m2",
                "visible" : false
              }
            ],
            [
              "AWS/ApplicationELB",
              "HTTPCode_Target_5XX_Count",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}",
              {
                "id" : "m3",
                "visible" : false
              }
            ],
            [
              {
                "expression" : "m1 + m2 + m3",
                "id" : "m4",
                "label" : "2xx + 4xx + 5xx",
                "visible" : false
              }
            ],
            [
              {
                "expression" : "m1 / m4 * 100",
                "id" : "m5",
                "label" : "Success Rate",
                "color" : "#ff7f0e"
              }
            ],
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Target Group Success Rate  (2xx / (2xx + 4xx + 5xx)) * 100",
          "yAxis" : {
            "left" : {
              "label" : "Success Rate (%)"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 12,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "RequestCount",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Target Group Request Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 12,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            ["AWS/ApplicationELB",
              "TargetResponseTime",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
            "${aws_lb_target_group.load_balancer_target_group.arn_suffix}"],
            ["...",
            { "stat" : "p99.00" }],
            ["...",
            { "stat" : "p95.00" }],
            ["...",
            { "stat" : "p90.00" }],
            ["...",
            { "stat" : "p50.00" }]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "stat" : "p95.00",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Target Group Response Time",
          "yAxis" : {
            "left" : {
              "label" : "TargetResponseTime (seconds)"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 18,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HTTPCode_ELB_5XX_Count",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Load Balancer 5XX Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 18,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HTTPCode_ELB_4XX_Count",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Load Balancer 4XX Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 24,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "ActiveConnectionCount",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Load Balancer Active Connection Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 24,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "RequestCount",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Load Balancer Request Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 30,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            ["AWS/ECS",
              "MemoryUtilization",
              "ServiceName",
              "${aws_ecs_service.ecs_service_server.name}",
              "ClusterName",
            "${local.ecs_cluster_name}"]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "stat" : "Average",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Average ECS MemoryUtilization",
          "yAxis" : {
            "left" : {
              "label" : "Average MemoryUtilization (%)"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 30,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            ["AWS/ECS",
              "MemoryUtilization",
              "ServiceName",
              "${aws_ecs_service.ecs_service_worker.name}",
              "ClusterName",
            "${local.ecs_cluster_name}"]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "stat" : "Average",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Worker Average ECS MemoryUtilization",
          "yAxis" : {
            "left" : {
              "label" : "Average MemoryUtilization (%)"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 36,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            ["AWS/ECS",
              "CPUUtilization",
              "ServiceName",
              "${aws_ecs_service.ecs_service_server.name}",
              "ClusterName",
            "${local.ecs_cluster_name}"]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "stat" : "Average",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Average ECS CPUUtilization",
          "yAxis" : {
            "left" : {
              "label" : "Average CPUUtilization (%)"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 36,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            ["AWS/ECS",
              "CPUUtilization",
              "ServiceName",
              "${aws_ecs_service.ecs_service_worker.name}",
              "ClusterName",
            "${local.ecs_cluster_name}"]
          ],
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "stat" : "Average",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Worker Average ECS CPUUtilization",
          "yAxis" : {
            "left" : {
              "label" : "Average CPUUtilization (%)"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 42,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "UnHealthyHostCount",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Maximum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Target Group Unhealthy Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 42,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HealthyHostCount",
              "LoadBalancer",
              "${aws_lb.load_balancer.arn_suffix}",
              "TargetGroup",
              "${aws_lb_target_group.load_balancer_target_group.arn_suffix}"
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Maximum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Server Target Group Healthy Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 48,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/SQS",
              "ApproximateAgeOfOldestMessage",
              "QueueName",
              "${local.payables_creation_queue}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Maximum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Payables Creation Queue ApproximateAgeOfOldestMessage",
          "yAxis" : {
            "left" : {
              "label" : "Max"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 48,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/SQS",
              "ApproximateNumberOfMessagesVisible",
              "QueueName",
              "${local.payables_creation_queue}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Payables Creation Queue ApproximateNumberOfMessagesVisible",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 54,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/SQS",
              "ApproximateAgeOfOldestMessage",
              "QueueName",
              "${local.payables_settlement_queue}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Maximum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Payables Settlement Queue ApproximateAgeOfOldestMessage",
          "yAxis" : {
            "left" : {
              "label" : "Max"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 54,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/SQS",
              "ApproximateNumberOfMessagesVisible",
              "QueueName",
              "${local.payables_settlement_queue}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Payables Settlement Queue ApproximateNumberOfMessagesVisible",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 60,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/SQS",
              "ApproximateAgeOfOldestMessage",
              "QueueName",
              "${local.transactions_settlement_queue}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Maximum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Transactions Settlement Queue ApproximateAgeOfOldestMessage",
          "yAxis" : {
            "left" : {
              "label" : "Max"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 60,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/SQS",
              "ApproximateNumberOfMessagesVisible",
              "QueueName",
              "${local.transactions_settlement_queue}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "Transactions Settlement Queue ApproximateNumberOfMessagesVisible",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 66,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/RDS",
              "CPUUtilization",
              "DBInstanceIdentifier",
              "${local.rds_name}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Average",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "RDS Average CPUUtilization",
          "yAxis" : {
            "left" : {
              "label" : "CPUUtilization"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 66,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/RDS",
              "DatabaseConnections",
              "DBInstanceIdentifier",
              "${local.rds_name}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Sum",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "RDS DatabaseConnections Count",
          "yAxis" : {
            "left" : {
              "label" : "Count"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 72,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/RDS",
              "FreeStorageSpace",
              "DBInstanceIdentifier",
              "${local.rds_name}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Average",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "RDS Average FreeStorageSpace",
          "yAxis" : {
            "left" : {
              "label" : "Average"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 72,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/RDS",
              "FreeableMemory",
              "DBInstanceIdentifier",
              "${local.rds_name}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Average",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "RDS Average FreeableMemory",
          "yAxis" : {
            "left" : {
              "label" : "Average"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 78,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/RDS",
              "ReadIOPS",
              "DBInstanceIdentifier",
              "${local.rds_name}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Average",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "RDS Average ReadIOPS",
          "yAxis" : {
            "left" : {
              "label" : "Average"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 78,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/RDS",
              "ReadLatency",
              "DBInstanceIdentifier",
              "${local.rds_name}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Average",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "RDS Average ReadLatency",
          "yAxis" : {
            "left" : {
              "label" : "Average"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 0,
        "y" : 84,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/RDS",
              "WriteIOPS",
              "DBInstanceIdentifier",
              "${local.rds_name}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Average",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "RDS Average WriteIOPS",
          "yAxis" : {
            "left" : {
              "label" : "Average"
            }
          }
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 78,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "metrics" : [
            [
              "AWS/RDS",
              "WriteLatency",
              "DBInstanceIdentifier",
              "${local.rds_name}",
            ]
          ],
          "view" : "timeSeries",
          "stat" : "Average",
          "stacked" : false,
          "region" : "${var.aws_region}",
          "period" : 60,
          "legend" : {
            "position" : "right"
          },
          "title" : "RDS Average WriteLatency",
          "yAxis" : {
            "left" : {
              "label" : "Average"
            }
          }
        }
      },
    ]
  })
}
