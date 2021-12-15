.PHONY: default all build test down

default: all

build:
	@docker-compose build --no-cache

all:
	@docker-compose up rest-server sqs-workers

infra:
	@docker-compose up -d postgres localstack

down:
	@docker-compose down --rmi local --remove-orphans

test:
	@docker-compose run --rm test
