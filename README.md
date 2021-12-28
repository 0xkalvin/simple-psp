# Simple PSP

A dead simple payment service Provider API to illustrate how transactions are processed and how money becomes available to the merchants.

## Architecture

This simplified payment service provider has two main responsabilites: to process card transactions and to settle customer's payables when they are due. In this context, throughput, consistency, and reliability are really important. With this in mind, the architecture here leverages async communication through messaging queues (SQS), and consistency using a SQL database (Postgres, supports database transactions, complex access patterns). When a transaction is received, it gets persisted in the database, and then it will be eventually processed and settled in the background by queue workers.
The overall flow in a nutshell is:
1) HTTP server receives a request to create a transaction
2) Server persisted it in the database (Postgres)
3) Server enqueues a message into SQS for further background processing
4) Workers consume SQS queues. In particular, the payables creation queue is consumed and payables are created for that specific transaction.

<p align="center">
<img src="./docs/images/infra.png" alt="drawing" width="650" height="400"/>
</p>

Lastly, when a payable is due, it should be marked it as `paid` as well as the original transaction. For this, there are batch jobs that queries the database for payables and transactions so that they can be settled.

## Directory structure
Inspired by [Netflix article on hexagonal architecture](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749).

```
src // Application code
├── config              // Configuration files.
├── data-sources        // Handles communications with data sources, like databases, messaging queues, and other APIs.
│   ├── postgres
│   │   ├── migrations
│   │   └── models
│   └── sqs
├── lib                 // Utilities reused throughout the codebase.
│   └── errors
├── repositories        // Abstracts data source specific operations from business logic.
├── services            // Where actual business logic is, orchestrates actions.
├── transporters        //  Triggers an interactor to perform business logic. We treat it as an input for our system.
│   ├── jobs            // One-off tasks, batch jobs
│   ├── rest            // Rest HTTP 1.1 server
│   │   ├── controllers
│   │   └── middlewares
│   └── sqs             // SQS queue consumers
│       └── workers
└── validators          // Schemas and validators for business entities and payloads
infrastructure // Terraform code
```
This structure has a two main advantages that I find particularly interesting:
- Swapping data sources (like databases) is easier
- Business actions can be executed/initiated from many differents entrypoints and protocols, such as HTTP, GRPC, messaging queues, CLI, cron jobs, etc.

## Tech stack

The Simple PSP project is written in **Node.JS** and its infrastructure is built as code using **Terraform**. Here's a complete list of the tech stack used to build the entire project:

- Node.JS (Express, Sequelize, AWS SDK, Ava, Supertest )
- Terraform + AWS (RDS, SQS, ECS Fargate, Parameter Storage, ALB, CloudWatch alarms and dashboard)
- Docker & Docker Compose
- Github Actions

## Local setup

Clone the repository:

```
git clone git@github.com:0xkalvin/simple-psp.git

cd simple-psp
```

To start the application just run:

```
make
```

This will initialize the necessary infrastructure (Postgres and localstack containers), as well as the PSP API itself.

## API

This section describes the resources that make up the API

### POST /transactions

#### Request

```bash
curl -XPOST "http://localhost:3000/transactions" --header "Content-Type: application/json" --header "x-customer-id: 123"  --data '{
    "description": "Lightsaber",
    "amount": "2500",
    "payment_method": "credit_card",
    "card_number": "4111111111111111",
    "card_holder_name": "Luke Skywalker",
    "card_expiration_date": "10/25",
    "card_verification_code": "123" }'
```

#### Response
201 status code
```json
{
  "id": "24e249f8-ca37-430a-afe9-bf05d9cd5688",
  "description": "Lightsaber",
  "customer_id":"123",
  "amount": 2500,
  "payment_method": "credit_card",
  "card_holder_name": "Luke Skywalker",
  "card_expiration_date": "2025-10-01T00:00:00.000Z",
  "card_verification_code": "123",
  "card_last_four_numbers": "1111",
  "updated_at": "2020-07-19T22:26:23.693Z",
  "created_at": "2020-07-19T22:26:23.693Z"
}
```

### GET /transactions

#### Request

```bash
curl http://localhost:3000/transactions --header "x-customer-id: 123"
```

#### Response
200 status code
```json
[
  {
    "id": "24e249f8-ca37-430a-afe9-bf05d9cd5688",
    "customer_id":"123",
    "description": "Lightsaber",
    "amount": 2500,
    "payment_method": "credit_card",
    "card_holder_name": "Luke Skywalker",
    "card_expiration_date": "2025-10-01T00:00:00.000Z",
    "card_verification_code": "123",
    "card_last_four_numbers": "1111",
    "updated_at": "2020-07-19T22:26:23.693Z",
    "created_at": "2020-07-19T22:26:23.693Z"
  }
]
```

### GET /payables

#### Request

```bash
curl http://localhost:3000/payables --header "x-customer-id: 123"
```

#### Response
200 status code
```json
[
  {
    "id": "4833e715-fb9b-4c60-8b8f-5bab65ea11e5",
    "customer_id":"123",
    "status": "waiting_funds",
    "payment_date": "2020-08-18T22:26:23.693Z",
    "fee": 5,
    "receivable_amount": 2375,
    "created_at": "2020-07-19T22:26:23.701Z",
    "updated_at": "2020-07-19T22:26:23.701Z",
    "transaction_id": "24e249f8-ca37-430a-afe9-bf05d9cd5688"
  }
]
```
