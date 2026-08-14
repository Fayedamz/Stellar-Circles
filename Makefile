.PHONY: help install build test clean contracts frontend backend docker

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (npm + cargo)
	npm install
	cd contracts/circle && cargo build
	cd contracts/membership && cargo build

build: ## Build all packages and contracts
	npm run build
	cd contracts/circle && cargo build --release --target wasm32-unknown-unknown
	cd contracts/membership && cargo build --release --target wasm32-unknown-unknown

test: ## Run all tests
	@echo "Running contract tests..."
	cd contracts/circle && cargo test
	cd contracts/membership && cargo test
	@echo "Running npm tests..."
	npm test --if-present

test-contracts: ## Run only contract tests
	cd contracts/circle && cargo test
	cd contracts/membership && cargo test

test-frontend: ## Run frontend tests
	cd apps/web && npm test

test-backend: ## Run backend tests
	cd apps/api && npm test

clean: ## Clean build artifacts
	rm -rf node_modules
	rm -rf apps/*/node_modules apps/*/.next apps/*/dist
	rm -rf packages/*/node_modules packages/*/dist
	cd contracts/circle && cargo clean
	cd contracts/membership && cargo clean

docker: ## Start Docker services (PostgreSQL, MongoDB, Redis)
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-logs: ## View Docker service logs
	docker-compose logs -f

db-migrate: ## Run database migrations
	npm run db:migrate

db-seed: ## Seed database with demo data
	npm run db:seed

dev: ## Start all dev servers
	npm run dev

dev-frontend: ## Start only frontend dev server
	cd apps/web && npm run dev

dev-backend: ## Start only backend dev server
	cd apps/api && npm run dev

lint: ## Run linters
	npm run lint
	cd contracts/circle && cargo clippy -- -D warnings
	cd contracts/membership && cargo clippy -- -D warnings

format: ## Format code
	npm run format --if-present
	cd contracts/circle && cargo fmt
	cd contracts/membership && cargo fmt

soroban-start: ## Start local Soroban network
	soroban network start

soroban-stop: ## Stop local Soroban network
	soroban network stop

deploy-contracts-local: ## Deploy contracts to local Soroban network
	@echo "Building contracts..."
	cd contracts/circle && cargo build --release --target wasm32-unknown-unknown
	cd contracts/membership && cargo build --release --target wasm32-unknown-unknown
	@echo "Deploying circle contract..."
	soroban contract deploy \
		--wasm contracts/circle/target/wasm32-unknown-unknown/release/stellar_circles_circle.wasm \
		--network local
	@echo "Deploying membership contract..."
	soroban contract deploy \
		--wasm contracts/membership/target/wasm32-unknown-unknown/release/stellar_circles_membership.wasm \
		--network local

setup: install docker db-migrate ## Full project setup
	@echo "✓ Setup complete! Run 'make dev' to start development servers."
