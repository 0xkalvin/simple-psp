.PHONY: default all dev test clean database

default: all

dev:
	npm run dev

all:
	sudo docker-compose up --build psp

infra:
	sudo docker-compose up -d postgres sqs

clean:
	sudo docker-compose down --rmi all
