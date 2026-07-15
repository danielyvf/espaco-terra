# script que consome as APIs externas (NASA/USGS) e salva no banco

import requests
from datetime import datetime
from .models import DesastreNatural, EventoSolar

def atualizar_terremotos():
    """Busca os terremotos das últimas 24 horas na API do USGS e salva no banco de dados"""
    
    # URL oficial da API do USGS para terremotos de magnitude 2.5 ou maior no último dia
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
    
    try:
        # Faz a requisição 
        resposta = requests.get(url, timeout=10)
        dados = resposta.json() # Transforma a resposta em um dicionário Python
        
        # A API organiza os dados dentro das features
        eventos = dados.get('features', [])
        
        novos_registros = 0
        
        for evento in eventos:
            propriedades = evento['properties']
            geometria = evento['geometry']
            
            # Extrai as informações
            id_externo = evento['id'] # ID único do terremoto na API
            localizacao = propriedades['place']
            magnitude = propriedades['mag']
            
            # A API envia o tempo em 'Timestamp milissegundos'. Converte para Data/Hora real:
            timestamp_segundos = propriedades['time'] / 1000
            data_hora_real = datetime.fromtimestamp(timestamp_segundos)
            
            longitude = geometria['coordinates'][0]
            latitude = geometria['coordinates'][1]
            
            # Evita duplicidade. Só salva no banco se esse terremoto exato já não foi salvo antes
            # Usa a combinação de localização e data_hora para checar se ele já existe
            ja_existe = DesastreNatural.objects.filter(
                localizacao=localizacao, 
                data_hora=data_hora_real
            ).exists()
            
            if not ja_existe:
                # Usa o ORM do Django para criar uma nova linha na tabela!
                DesastreNatural.objects.create(
                    tipo='TERREMOTO',
                    data_hora=data_hora_real,
                    latitude=latitude,
                    longitude=longitude,
                    magnitude=magnitude,
                    localizacao=localizacao
                )
                novos_registros += 1
                
        print(f"Sucesso! {novos_registros} novos terremotos foram adicionados ao banco de dados.")
        
    except Exception as e:
        print(f"Erro ao conectar com a API do USGS: {e}")

def atualizar_dados_solares():
    """Busca o índice Kp atualizado nas últimas 24 horas na API da NOAA/NASA"""
    url = "https://services.swpc.noaa.gov/products/noaa-scales.json"
    
    try:
        resposta = requests.get(url, timeout=10)
        dados = resposta.json()
        
        novos_registros = 0
        
        # A API da NOAA retorna um dicionário onde a chave '0' traz o relatório mais recente
        if '0' in dados:
            relatorio_atual = dados['0']
            
            # Extraindo as informações geomagnéticas
            # O índice Kp geralmente vem associado à escala 'G' (tempestades geomagnéticas)
            escala_g = relatorio_atual.get('Geomagnetic', {}).get('Scale', 'G0')
            kp_estimado = float(relatorio_atual.get('Geomagnetic', {}).get('Kp', 0.0))
            descricao_alerta = relatorio_atual.get('Geomagnetic', {}).get('Text', '')
            
            data_hora_real = datetime.now() # Registra o momento da captura atual
            
            # Evita salvar duplicados no mesmo minuto
            ja_existe = EventoSolar.objects.filter(
                data_hora__year=data_hora_real.year,
                data_hora__month=data_hora_real.month,
                data_hora__day=data_hora_real.day,
                data_hora__hour=data_hora_real.hour,
                data_hora__minute=data_hora_real.minute
            ).exists()
            
            if not ja_existe:
                EventoSolar.objects.create(
                    data_hora=data_hora_real,
                    indice_kp=kp_estimado,
                    tipo_alerta=escala_g,
                    descricao=descricao_alerta
                )
                novos_registros += 1
                
        print(f"Sucesso! {novos_registros} novos dados solares adicionados.")
        
    except Exception as e:
        print(f"Erro ao conectar com a API da NOAA: {e}")