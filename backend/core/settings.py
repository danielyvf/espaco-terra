import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Carrega o arquivo .env se ele existir localmente
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Chave secreta lida do ambiente
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'chave-temporaria-desenv-12345')

# Em produção na Vercel/Render, DEBUG deve ser False por padrão se não definido no ambiente
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Permite chamadas do Render, da Vercel e de conexões locais
ALLOWED_HOSTS = [
    'espaco-terra.onrender.com',
    '.onrender.com',
    '.vercel.app',  # Permite qualquer subdomínio da Vercel
    'localhost',
    '127.0.0.1',
]

# Configuração do Banco de Dados (SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

ROOT_URLCONF = 'core.urls'

# Configurações de segurança e middlewares
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Deve permanecer no topo
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

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

# Configuração de arquivos estáticos
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Configuração de CORS para permitir conexões do Frontend na Vercel e Local
CORS_ALLOW_ALL_ORIGINS = False  # Mantido True para evitar bloqueios durante o desenvolvimento

APPEND_SLASH = False

CORS_ALLOWED_ORIGINS = [
    'https://espaco-terra-x5hi.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
]