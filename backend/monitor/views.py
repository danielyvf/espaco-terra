# Lógica que entrega os dados quando o React pede

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import EventoSolar, DesastreNatural
from .serializers import EventoSolarSerializer, DesastreNaturalSerializer

# 👉 ESSA LINHA É FUNDAMENTAL: Importa os scripts que buscam os dados na NASA/USGS
from .services import atualizar_terremotos, atualizar_dados_solares

class DashboardDadosCruzadosAPIView(APIView):
    """API que junta os dados do Sol e da Terra em uma única resposta para o React"""
    
    def get(self, request, format=None):
        # 1. Antes de ler o banco, vai na internet buscar dados novos e salvar nas tabelas
        try:
            atualizar_terremotos()
            atualizar_dados_solares()
        except Exception as e:
            # Se a internet cair ou der erro nas APIs do governo, o app não trava, ele avisa no terminal
            print(f"Aviso: Não foi possível atualizar os dados externos: {e}")
            
        # 2. AJUSTE CIENTÍFICO: Trocamos o '-id' por '-data_hora' para garantir a linha do tempo perfeita.
        # Aumentamos o limite para [:100] para dar mais histórico de dias anteriores para o cálculo do atraso (delay).
        eventos_solares = EventoSolar.objects.all().order_by('-data_hora')[:100]
        desastres_terra = DesastreNatural.objects.all().order_by('-data_hora')[:100]
        
        # Passa os dados brutos do banco pelos tradutores (serializers)
        sol_serializer = EventoSolarSerializer(eventos_solares, many=True)
        terra_serializer = DesastreNaturalSerializer(desastres_terra, many=True)
        
        # Monta a estrutura final do JSON que será enviada para o Front-end
        resposta_final = {
            "dados_solares": sol_serializer.data,
            "desastres_naturais": terra_serializer.data # Mantido exatamente o seu padrão original
        }
        
        return Response(resposta_final, status=status.HTTP_200_OK)