import React from 'react';
import Globe from 'react-globe.gl';

export function Globo3D({ dadosSolares, desastresNaturais, aoClicarNoPais }) {
  // Configuração dos pontos vermelhos (terremotos) na Terra
  const pontosTerremotos = desastresNaturais.map(terremoto => ({
    lat: terremoto.latitude,
    lng: terremoto.longitude,
    size: terremoto.magnitude * 2, // Quanto maior a magnitude, maior o ponto
    color: 'red',
    label: `${terremoto.localizacao} - Mag: ${terremoto.magnitude}`
  }));

  return (
    <div className="globo-container" style={{ width: '100%', height: '500px' }}>
      <Globe
        width={700}
        height={500}
        // Imagem plana 
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Desenha os terremotos vindos do Django como pontos na superfície
        labelsData={pontosTerremotos}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={d => d.label}
        labelSize={d => d.size * 0.2}
        labelColor={d => d.color}

        // Detecta o clique no Globo e avisa a View principal
        onGlobeClick={({ lat, lng }) => {
          aoClicarNoPais(lat, lng);
        }}
      />
    </div>
  );
}