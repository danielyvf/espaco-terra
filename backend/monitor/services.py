import requests
from datetime import datetime, timezone as dt_timezone
from .models import DesastreNatural, EventoSolar
from django.utils import timezone

def atualizar_terremotos():
    """Busca os terremotos das últimas 24 horas na API do USGS e salva no banco de dados"""
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
    
    try:
        resposta = requests.get(url, timeout=10)
        
        if resposta.status_code != 200:
            print(f"Erro USGS HTTP: {resposta.status_code}")
            return

        dados = resposta.json()
        eventos = dados.get('features', [])
        
        novos_registros = 0
        
        for evento in eventos:
            propriedades = evento['properties']
            geometria = evento['geometry']
            
            # Garante que não vem nulo
            if propriedades.get('mag') is None:
                continue

            localizacao = propriedades.get('place', 'Local desconhecido')
            magnitude = propriedades['mag']
            
            # Converte timestamp em milissegundos para datetime UTC de forma segura
            timestamp_segundos = propriedades['time'] / 1000
            data_hora_real = datetime.fromtimestamp(timestamp_segundos, tz=dt_timezone.utc)
            
            longitude = geometria['coordinates'][0]
            latitude = geometria['coordinates'][1]
            
            # Trava para evitar duplicatas filtrando por localização e magnitude aproximada
            ja_existe = DesastreNatural.objects.filter(
                localizacao=localizacao,
                magnitude=magnitude,
                data_hora=data_hora_real
            ).exists()
            
            if not ja_existe:
                DesastreNatural.objects.create(
                    tipo='TERREMOTO',
                    data_hora=data_hora_real,
                    latitude=latitude,
                    longitude=longitude,
                    magnitude=magnitude,
                    localizacao=localizacao
                )
                novos_registros += 1
                
        print(f"Sucesso! {novos_registros} novos terremotos adicionados ao banco.")
        
    except Exception as e:
        print(f"Erro ao conectar com a API do USGS: {e}")