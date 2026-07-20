from django.contrib import admin
from .models import EventoSolar, DesastreNatural

@admin.register(EventoSolar)
class EventoSolarAdmin(admin.ModelAdmin):
    list_display = ('data_hora', 'indice_kp', 'tipo_alerta', 'velocidade_vento')
    list_filter = ('tipo_alerta',)
    search_fields = ('descricao',)

@admin.register(DesastreNatural)
class DesastreNaturalAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'localizacao', 'magnitude', 'data_hora')
    list_filter = ('tipo',)
    search_fields = ('localizacao',)