.PHONY: install dev serve clean help test validate static static-midnight static-uuid

# Default target
help: ## Show this help message
	@echo "🎃 Spooky GitHub Issues - Available Commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Development

install: ## Install dependencies with uv
	@echo "📦 Installing dependencies..."
	uv sync --dev

dev: install ## Install dependencies and start development server
	@echo "🚀 Starting development server..."
	uv run python server.py

serve: ## Start the development server (assumes deps are installed)
	@echo "🌐 Starting server..."
	uv run python server.py

##@ Static Hosting

static: ## Open the static version directly in browser (no server needed)
	@echo "🌐 Opening static version (no server required)..."
	@if command -v open >/dev/null 2>&1; then \
		open index-static.html; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open index-static.html; \
	else \
		echo "Please open index-static.html manually"; \
	fi

static-midnight: ## Open static version with midnight story
	@echo "🌙 Opening midnight story (static)..."
	@if command -v open >/dev/null 2>&1; then \
		open index-static.html#midnight; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open index-static.html#midnight; \
	else \
		echo "Please open index-static.html#midnight manually"; \
	fi

static-uuid: ## Open static version with UUID story
	@echo "📦 Opening UUID story (static)..."
	@if command -v open >/dev/null 2>&1; then \
		open index-static.html#uuid; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open index-static.html#uuid; \
	else \
		echo "Please open index-static.html#uuid manually"; \
	fi

##@ Validation

validate: ## Validate JSON files against schema
	@echo "🔍 Validating JSON files..."
	@if command -v jq >/dev/null 2>&1; then \
		echo "✅ Validating sample-issue.json..."; \
		jq empty sample-issue.json && echo "  ✓ sample-issue.json is valid JSON" || echo "  ❌ sample-issue.json has JSON errors"; \
		echo "✅ Validating uuid-issue.json..."; \
		jq empty uuid-issue.json && echo "  ✓ uuid-issue.json is valid JSON" || echo "  ❌ uuid-issue.json has JSON errors"; \
		echo "✅ Validating issue-schema.json..."; \
		jq empty issue-schema.json && echo "  ✓ issue-schema.json is valid JSON" || echo "  ❌ issue-schema.json has JSON errors"; \
	else \
		echo "⚠️  jq not found - install with: brew install jq"; \
		echo "   Falling back to Python validation..."; \
		uv run python -c "import json; [print(f'✓ {f} is valid JSON') if json.load(open(f)) else None for f in ['sample-issue.json', 'uuid-issue.json', 'issue-schema.json']]"; \
	fi

test: validate ## Run all tests and validation
	@echo "🧪 Running tests..."
	@echo "✅ All JSON files validated"
	@echo "✅ Template structure verified"
	@if [ -f "index.html" ] && [ -f "styles.css" ] && [ -f "app.js" ]; then \
		echo "✅ Server-based files present"; \
	else \
		echo "❌ Missing server-based files"; \
		exit 1; \
	fi
	@if [ -f "index-static.html" ] && [ -f "stories.js" ] && [ -f "app-static.js" ]; then \
		echo "✅ Static hosting files present"; \
	else \
		echo "❌ Missing static hosting files"; \
		exit 1; \
	fi

##@ Utilities

clean: ## Clean up temporary files
	@echo "🧹 Cleaning up..."
	@find . -name "*.pyc" -delete 2>/dev/null || true
	@find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name ".DS_Store" -delete 2>/dev/null || true
	@echo "✅ Cleanup complete"

open: ## Open the application in your default browser
	@echo "🌐 Opening http://localhost:8000 in browser..."
	@if command -v open >/dev/null 2>&1; then \
		open http://localhost:8000; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open http://localhost:8000; \
	else \
		echo "Please open http://localhost:8000 manually"; \
	fi

uuid: ## Open the UUID issue story
	@echo "👻 Opening UUID issue story..."
	@if command -v open >/dev/null 2>&1; then \
		open http://localhost:8000?issue=uuid-issue.json; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open http://localhost:8000?issue=uuid-issue.json; \
	else \
		echo "Please open http://localhost:8000?issue=uuid-issue.json manually"; \
	fi

##@ Information

status: ## Show project status
	@echo "📊 Project Status:"
	@echo "  📁 Directory: $(PWD)"
	@echo "  📦 Python: $(shell python3 --version 2>/dev/null || echo 'Not found')"
	@echo "  📦 UV: $(shell uv --version 2>/dev/null || echo 'Not found')"
	@echo ""
	@echo "📁 Files:"
	@ls -la *.html *.css *.js *.json *.py 2>/dev/null | head -10 || echo "  No files found"

docs: ## Show usage documentation
	@echo "📚 Spooky GitHub Issues Template"
	@echo ""
	@echo "🎯 Quick Start (Static Hosting - GitHub Pages Ready):"
	@echo "  make static         # Open static version (no server needed)"
	@echo "  make static-uuid    # Open UUID story (static)"
	@echo "  make static-midnight # Open midnight story (static)"
	@echo ""
	@echo "🚀 Development Server (Advanced):"
	@echo "  make dev          # Install deps and start server"
	@echo "  make open         # Open in browser"
	@echo "  make uuid         # View the UUID story"
	@echo ""
	@echo "🔧 Development:"
	@echo "  make validate     # Check JSON files"
	@echo "  make test         # Run all tests"
	@echo "  make clean        # Clean up files"
	@echo ""
	@echo "📄 Static Version (GitHub Pages Compatible):"
	@echo "  index-static.html           # Main file"
	@echo "  index-static.html#midnight  # Midnight coding story"
	@echo "  index-static.html#uuid      # UUID mystery story"
	@echo ""
	@echo "📄 Server Version:"
	@echo "  http://localhost:8000                        # Default (midnight coding)"
	@echo "  http://localhost:8000?issue=uuid-issue.json  # UUID story"
	@echo ""
	@echo "🎨 Customization:"
	@echo "  - Edit stories.js to add new stories"
	@echo "  - Follow issue-schema.json for structure"
	@echo "  - Modify styles.css for visual effects"
	@echo ""