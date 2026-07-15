# Transforma os dados do banco em JSON para a API

from rest_framework import serializers
from .models import EventoSolar, DesastreNatural

class EventoSolarSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoSolar
        fields = '__all__'


class DesastreNaturalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesastreNatural
        fields = '__all__'