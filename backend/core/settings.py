# Configurações gerais
import os
from pathlib import Path
from dotenv import load_dotenv, load_dotenv # importa o dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env')) # carrega o arquivo .env

# Agora o Django lê do arquivo oculto:
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Define quem pode acessar o servidor localmente
# Permite rodar localmente e também no endereço que o Render vai dar
ALLOWED_HOSTS = ['espaco-terra.onrender.com']

# Configuração padrão do Banco de Dados (SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Configuração técnica para o Django gerenciar as URLs
ROOT_URLCONF = 'core.urls'

# Configurações de segurança e filtros (Middlewares) requisitados pelo Django
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Configuração de renderização de telas (necessária para o painel Admin do Django)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Apps e extensões
    'rest_framework',
    'monitor',
]

# Configuração obrigatória para o Django gerenciar arquivos estáticos (CSS, JS)
STATIC_URL = 'static/'

# servidor do render
CORS_ALLOWED_ORIGINS = [
    "https://espaco-terra-m69d.vercel.app",
    "https://espaco-terra-m69d-danielyvfs-projects.vercel.app"
    ]