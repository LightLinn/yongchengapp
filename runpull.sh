git stash
git pull

cd server/
poetry run gunicorn -c gunicorn_config.py server.wsgi:application