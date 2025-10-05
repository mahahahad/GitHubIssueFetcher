# Makefile for backend Python tasks using uv package manager
# Usage examples:
#   make help                Show available targets
#   make setup               Ensure uv installed, create .venv and sync dependencies
#   make db-init             Initialize the SQLite database schema
#   make fetch-sqlite        Fetch GitHub repos and store into SQLite (DATABASE_TYPE=sqlite)
#   make fetch-supabase      Fetch GitHub repos and store into Supabase (default)
#   make clean               Remove virtual environment and cache files
#
# Advanced:
#   make reinstall           Re-create venv and re-sync deps
#
# Detect OS shell
SHELL := /bin/bash

# Python project directory
PY_BACKEND_DIR := backend-python
PYPROJECT := $(PY_BACKEND_DIR)/pyproject.toml
VENV_DIR := $(PY_BACKEND_DIR)/.venv

# uv command (allow override: make UV=path/to/uv setup)
UV ?= uv

# Python executable inside venv (set after venv creation)
PYTHON := $(VENV_DIR)/bin/python

.PHONY: help setup ensure-uv uv-version venv sync db-init fetch-sqlite fetch-supabase fetch reinstall clean

help:
	@echo "Available targets:"
	@echo "  setup            - Install uv if missing, create venv, sync dependencies"
	@echo "  db-init          - Initialize the SQLite database schema"
	@echo "  fetch-sqlite     - Fetch GitHub repo data into SQLite (sets DATABASE_TYPE=sqlite)"
	@echo "  fetch-supabase   - Fetch GitHub repo data into Supabase (default behavior)"
	@echo "  fetch            - Alias for fetch-sqlite"
	@echo "  reinstall        - Remove then re-create venv and sync dependencies"
	@echo "  clean            - Remove venv and Python cache artifacts"
	@echo "Environment variables:"
	@echo "  UV=/path/to/uv to use a specific uv binary"
	@echo "  PAGES=5 PER_PAGE=50 to control fetch pagination (optional)"

# Check for uv and prompt install instructions if missing
ensure-uv:
	@if ! command -v $(UV) >/dev/null 2>&1; then \
		echo "[INFO] 'uv' not found."; \
		echo "Install on Linux/macOS:"; \
		echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"; \
		echo "Then re-run: make setup"; \
		exit 1; \
	fi

uv-version: ensure-uv
	@$(UV) --version

# Create virtual environment using uv
venv: ensure-uv
	@if [ ! -d "$(VENV_DIR)" ]; then \
		cd $(PY_BACKEND_DIR) && $(UV) venv; \
		echo "[OK] Created virtual environment at $(VENV_DIR)"; \
	else \
		echo "[SKIP] $(VENV_DIR) already exists"; \
	fi

# Sync dependencies from pyproject
sync: venv
	@cd $(PY_BACKEND_DIR) && $(UV) sync
	@echo "[OK] Dependencies synced"

setup: sync uv-version
	@echo "[DONE] Backend Python environment ready. To activate: source $(VENV_DIR)/bin/activate"

# Initialize SQLite database
db-init: sync
	@echo "[INFO] Initializing SQLite database..."
	@cd $(PY_BACKEND_DIR) && $(PYTHON) init_sqlite_db.py

# Fetch data into SQLite
fetch-sqlite: db-init
	@echo "[INFO] Fetching GitHub repositories into SQLite..."
	@cd $(PY_BACKEND_DIR) && DATABASE_TYPE=sqlite PAGES=$${PAGES:-5} PER_PAGE=$${PER_PAGE:-50} $(PYTHON) main.py

# Fetch data into Supabase
fetch-supabase: sync
	@echo "[INFO] Fetching GitHub repositories into Supabase..."
	@cd $(PY_BACKEND_DIR) && $(PYTHON) main.py

# Convenience alias (default to sqlite for local dev)
fetch: fetch-sqlite

reinstall: clean setup

clean:
	@echo "[INFO] Removing virtual environment and Python cache files..."
	@rm -rf $(VENV_DIR)
	@find $(PY_BACKEND_DIR) -type d -name '__pycache__' -prune -exec rm -rf {} +
	@echo "[DONE] Clean complete"
