cp -rv database/ /home/

git stash
git pull

cd /home
cp -rv database/ /home/yongchengapp/
cd /home/yongchengapp/server

poetry run python manage.py makemigrations
poetry run python manage.py migrate

# cd server/
poetry run gunicorn -c gunicorn_config.py server.wsgi:application