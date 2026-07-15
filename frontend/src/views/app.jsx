import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globo3D } from '../components/Globo3D'; // Importa o globo

export default function DashboardPrincipal() {
  // Estados para guardar os dados que vêm do Django
  const [dadosSolares, setDadosSolares] = useState([]);
  const [desastresNaturais, setDesastresNaturais] = useState([]);
  const [coordenadaClicada, setCoordenadaClicada] = useState(null);

  // (Axios) vai buscar os dados no Django assim que a tela carrega
  useEffect(() => {
    axios.get('http://localhost:8000/api/dados-cruzados/')
      .then(resposta => {
        // Guarda os dados reais do Django nos estados do React
        setDadosSolares(resposta.data.dados_solares);
        setDesastresNaturais(resposta.data.desastres_naturais);
      })
      .catch(erro => {
        console.error("Erro ao conectar com o Django Back-end:", erro);
      });
  }, []);

  // Função que roda quando o usuário clica em algum lugar do planeta 3D
  const gerenciarCliqueNoGlobo = (lat, lng) => {
    setCoordenadaClicada({ lat, lng });
  };

  return (
    <div style={{ display: 'flex', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* LADO ESQUERDO: O SEU COMPONENTE GLOBO 3D */}
      <div style={{ flex: 1 }}>
        <h2>Monitor Espaço-Terra 3D</h2>
        <Globo3D 
          dadosSolares={dadosSolares}
          desastresNaturais={desastresNaturais}
          aoClicarNoPais={gerenciarCliqueNoGlobo}
        />
      </div>

      {/* LADO DIREITO: PAINEL LATERAL DE INFORMAÇÕES */}
      <div style={{ width: '350px', background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h3>Informações da Região</h3>
        {coordenadaClicada ? (
          <p>Você clicou em: <strong>Lat: {coordenadaClicada.lat.toFixed(2)} | Lng: {coordenadaClicada.lng.toFixed(2)}</strong></p>
        ) : (
          <p>Clique em um ponto do globo para analisar.</p>
        )}

        <hr />
        
        <h3>Clima Espacial Atual (NOAA)</h3>
        {dadosSolares.length > 0 ? (
          <div>
            <p><strong>Índice Kp:</strong> {dadosSolares[0].indice_kp}</p>
            <p><strong>Alerta:</strong> {dadosSolares[0].tipo_alerta}</p>
            <small>{dadosSolares[0].descricao}</small>
          </div>
        ) : (
          <p>Carregando dados do Sol...</p>
        )}
      </div>

    </div>
  );
}