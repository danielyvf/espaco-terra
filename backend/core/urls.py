from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Função simples para responder à raiz (Health Check do Render)
def home(request):
    return JsonResponse({"status": "API Espaço Terra está online!"})

urlpatterns = [
    path('', home),  
    path('admin/', admin.site.urls),
    path('api/', include('monitor.urls')), # Conecta as rotas do app monitor
]