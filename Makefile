up:
	cp .env.example .env
	docker compose up -d
	docker compose exec app composer install
	docker compose exec app php artisan key:generate
	docker compose exec app php artisan livewire:publish --assets
	docker compose exec app php artisan filament:assets
	docker compose exec app php artisan filament:install --panels
	docker compose exec app php artisan migrate
	docker compose exec app php artisan db:seed
	docker compose exec app npm install
	docker compose exec app npm run build
