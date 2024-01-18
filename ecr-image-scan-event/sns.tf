data "aws_caller_identity" "current" {}

resource "aws_sns_topic" "ecr-image-scan-topic" {
  name = "ecr-image-scan-topic"
}

resource "aws_sns_topic_policy" "ecr-image-scan-topic-policy" {
  arn    = aws_sns_topic.ecr-image-scan-topic.arn
  policy = data.aws_iam_policy_document.ecr-image-scan-topic-policy.json
}

data "aws_iam_policy_document" "ecr-image-scan-topic-policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "SNS:GetTopicAttributes",
      "SNS:SetTopicAttributes",
      "SNS:AddPermission",
      "SNS:RemovePermission",
      "SNS:DeleteTopic",
      "SNS:Subscribe",
      "SNS:ListSubscriptionsByTopic",
      "SNS:Publish",
    ]

    resources = [aws_sns_topic.ecr-image-scan-topic.arn]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceOwner"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }

  statement {
    sid    = "Allow event to publish to the topic"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.ecr-image-scan-topic.arn]
  }
}
