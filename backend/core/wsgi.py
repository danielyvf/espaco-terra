import os

from django.core.wsgi import get_wsgi_application

# Aponta para o arquivo de configurações dentro da pasta core
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()