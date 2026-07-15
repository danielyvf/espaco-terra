# Rotas principais do servidor
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('monitor.urls')), # Conecta as rotas do app monitor com o prefixo /api/
]