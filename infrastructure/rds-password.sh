
#!/bin/sh

set -e

region="$1"
instance_id="$2"
parameter_name="$3"

profile=${AWS_PROFILE}

echo "[INFO]: Generating RDS instance password..."
password="$(openssl rand -hex 32)"
echo "[SUCCESS]: Generated RDS instance password successfully!!!"

echo "[INFO]: Updating RDS database password..."
aws --region=$region --profile=$profile rds modify-db-instance --db-instance-identifier $instance_id --master-user-password $password
echo "[SUCCESS]: Updated RDS instance password successfully!!!"

echo "[INFO]: Sending password to parameter storage..."
aws --region=$region --profile=$profile ssm put-parameter --name $parameter_name --type "SecureString" --value $password --overwrite
echo "[SUCCESS]: Sent password to parameter storage successfully!!!"
