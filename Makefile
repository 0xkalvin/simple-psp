.PHONY: default all dev test clean database

default: all

dev:
	npm run dev

all:
	sudo docker-compose up psp

database:
	sudo docker-compose up -d postgres

clean:
	sudo docker-compose down --rmi all
