BUN_EXISTS := $(shell command -v bun 2> /dev/null)

# 初期の開発環境(ローカル)設定
setup: env
ifeq ($(BUN_EXISTS),) # bun 必須
	@echo "bun コマンドが存在しません。"
else
	docker compose up -d db
	bun i --frozen-lockfile
	bun run setup
	bun run build
endif


# 環境設定ファイルを初期設定。要編集
env:
	if [ ! -f .env ]; then cp .env.example .env; fi


# すべてのコンテナ、イメージ、ボリュームを削除
clean:
	docker compose down --rmi all --volumes --remove-orphans
	rm -Rf postgres-data data


# 再セットアップ
reset: clean setup


# DBシード
seed:
	docker compose up -d db
	bun run seed


# ローカル開発サーバを起動
dev:
	docker compose up -d db
	bun run dev


# DB停止
down:
	docker compose down
