#	Docker

## Prod

1. docker compose -f docker-compose.yml build maru_lake
2. docker compose -f docker-compose.yml up -d maru_lake

## Stage

1. docker compose -f docker-compose.yml build maru_lake_stage
2. docker compose -f docker-compose.yml up -d maru_lake_stage

## Dev

1. docker compose -f docker-compose.yml build maru_lake_dev
2. docker compose -f docker-compose.yml up -d maru_lake_dev


