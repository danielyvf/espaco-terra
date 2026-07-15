# Modelagem do Banco de Dados (Tabela Sol e Tabela Terra) usando ORM

from django.db import models

class EventoSolar(models.Model):
    """Tabela para armazenar dados de atividade e tempestades solares (NASA/NOAA)"""
    data_hora = models.DateTimeField(help_text="Data e hora do evento registrado")
    indice_kp = models.FloatField(help_text="Índice Geomagnético Kp (vai de 0 a 9)")
    velocidade_vento = models.FloatField(null=True, blank=True, help_text="Velocidade do vento solar em km/s")
    tipo_alerta = models.CharField(max_length=50, null=True, blank=True, help_text="Classificação do alerta (ex: G1, G2, G3)")
    descricao = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-data_hora'] # Mostra sempre os eventos mais recentes primeiro

    def __str__(self):
        return f"Tempestade Solar KP-{self.indice_kp} em {self.data_hora}"


class DesastreNatural(models.Model):
    """Tabela para armazenar desastres na Terra, como terremotos (USGS)"""
    TIPO_CHOICES = [
        ('TERREMOTO', 'Terremoto'),
        ('ERUPCAO', 'Erupção Vulcânica'),
        ('OUTRO', 'Outro'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='TERREMOTO')
    data_hora = models.DateTimeField(help_text="Data e hora do evento na Terra")
    latitude = models.FloatField()
    longitude = models.FloatField()
    magnitude = models.FloatField(null=True, blank=True, help_text="Magnitude do evento (ex: Escala Richter para terremotos)")
    localizacao = models.CharField(max_length=255, help_text="Nome da região ou país do ocorrido")

    class Meta:
        ordering = ['-data_hora']

    def __str__(self):
        return f"{self.get_tipo_display()} - M {self.magnitude} em {self.localizacao}"