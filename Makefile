.PHONY: default all dev build test down database

default: all

dev:
	npm run dev

build:
	@docker-compose build --no-cache

all:
	@docker-compose up psp payable-worker

infra:
	@docker-compose up -d postgres sqs

down:
	@docker-compose down --rmi local --remove-orphans

test:
	@docker-compose up test