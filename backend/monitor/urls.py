# Rotas específicas dos dados da /api/tempestades/)
from django.urls import path
from .views import DashboardDadosCruzadosAPIView

urlpatterns = [
    path('dados-cruzados/', DashboardDadosCruzadosAPIView.as_view(), name='dados_cruzados_api'),
]