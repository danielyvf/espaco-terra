import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Globo3D } from '../components/Globo3D';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import sol1 from '../assets/img/sol1.jpg';
import '../components/responsivo.css';

export default function DashboardContainer() {
  const [dadosSolares, setDadosSolares] = useState([]);
  const [desastresNaturais, setDesastresNaturais] = useState([]);
  // 1. Criamos um estado para controlar se a API terminou de carregar
  const [carregandoDados, setCarregandoDados] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/dados-cruzados/')
      .then(resposta => {
        setDadosSolares(resposta.data.dados_solares || []);
        setDesastresNaturais(resposta.data.desastres_naturais || resposta.data.desastres_naturais || []); 
      })
      .catch(erro => console.error("Erro ao conectar com o Django:", erro))
      .finally(() => {
        // Quando a requisição termina (com sucesso ou erro), encerra o loading
        setCarregandoDados(false);
      });
  }, []);

  // Se a API ainda estiver carregando (ou o Render estiver acordando), exibe a tela de loading
  if (carregandoDados) {
    return <TelaCarregamento />;
  }

  // DASHBOARDBOARD CONTAINER 
  return (
    <Router>
      <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#000', color: '#fff', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, overflowX: 'hidden' }}>
        
        {/* COMPONENTE DE MENU HORIZONTAL SUPERIOR */}
        <nav style={{ 
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 'auto', 
          minHeight: '90px',
          background: '#000', 
          backdropFilter: 'blur(5px)',
          borderBottom: '1px solid #2d2d2d',
          padding: '10px 5%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          boxSizing: 'border-box',
          zIndex: 1000
        }}>
          <h2 style={{ color: '#fff', margin: 0, letterSpacing: '1px', fontSize: '1.4rem', fontFamily: '"Syncopate", sans-serif', }}>
            PAINEL GEOFISICO
          </h2>

          <div style={{ display: 'flex', gap: '25px', alignItems: 'center', fontFamily: '"Roboto Mono", monospace', }}>
            <Link to="/" style={estiloLinkMenu}>.INÍCIO</Link>
            <Link to="/analises" style={estiloLinkMenu}>.ANÁLISES</Link>
            <Link to="/artigos" style={estiloLinkMenu}>.ARTIGOS CIENTIFICOS</Link>
          </div>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
        <div style={{ paddingTop: '90px', width: '100%', minHeight: 'calc(100vh - 90px)', display: 'block' }}>
          <Routes>
            <Route path="/" element={<TelaInicio dadosSolares={dadosSolares} desastresNaturais={desastresNaturais} />} />
            
            <Route path="/analises" element={
              <div style={{ padding: '40px 0', background: '#000' }}>
                <TelaGlobo dadosSolares={dadosSolares} desastresNaturais={desastresNaturais} />
                <div style={{ borderTop: '1px solid #2d2d2d', marginTop: '40px', paddingTop: '40px' }}>
                  <TelaAnalises dadosSolares={dadosSolares} desastresNaturais={desastresNaturais} />
                </div>
              </div>
            } />
            
            <Route path="/artigos" element={<TelaArtigos />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

// TELA DE CARREGAMENTO
function TelaCarregamento() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: '"Roboto Mono", monospace',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Ícone de carregamento giratório */}
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid #2d2d2d',
        borderTop: '3px solid #ffb703', // Cor dourada simulando o vento solar
        borderRadius: '50%',
        animation: 'girar 1s linear infinite',
        marginBottom: '25px'
      }} />

      {/* Estilo CSS injetado temporariamente para fazer o círculo girar */}
      <style>{`
        @keyframes girar {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <h2 style={{ 
        margin: '0 0 10px 0', 
        fontSize: '1.2rem', 
        letterSpacing: '2px', 
        fontFamily: '"Syncopate", sans-serif',
        fontWeight: '300'
      }}>
        CONECTANDO COM A REDE GEOFÍSICA
      </h2>
      
      <p style={{ 
        color: '#888', 
        maxWidth: '500px', 
        fontSize: '0.85rem', 
        lineHeight: '1.6',
        margin: 0
      }}>
        Sincronizando telemetria de satélites e dados sísmicos globais... <br />
        <span style={{ color: '#555', fontSize: '0.75rem', display: 'block', marginTop: '10px' }}>
          (O primeiro carregamento pode levar até 1 minuto devido à inicialização do servidor gratuito)
        </span>
      </p>
    </div>
  );
}

function TelaInicio({ dadosSolares, desastresNaturais }) {
  const kpAtual = dadosSolares.length > 0 ? dadosSolares[0].indice_kp : 0;

  return (
    <div>
      {/* SEÇÃO BANNER DO SOL */}
      <section style={{
        minHeight: '100vh',
        background: `url(${sol1}) no-repeat center/cover`,
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px 60px 200px 60px', 
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '100px 0px 0px 0px', 
          color: '#fff', 
          fontFamily: '"Syncopate", sans-serif',
          fontWeight: '300',
          alignSelf: 'left', 
          textAlign: 'left'
        }}>
          Sistema de Análise <br/>espaço-terra
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', alignItems: 'center', width: '100%' }}>
          <h2 style={{
            position: 'absolute',
            top: '35%',
            left: '72%',
            fontSize: '0.9rem',
            color: '#fff', 
            fontWeight: '600',
            margin: 0,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap'
          }}>
            .sol
          </h2>

          <p style={{ fontSize: '1.0rem', color: '#eee', maxWidth: '700px', margin: '0px 0 40px 0', lineHeight: '1.4', fontFamily: '"Roboto Mono", monospace',}}>
            Monitoramento em tempo real da atividade solar e indices geomagneticos do planeta Terra.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.75)', padding: '15px 30px', borderRadius: '8px', border: '1px solid #fff', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: '1rem', letterSpacing: '0.5px', fontFamily: '"Roboto Mono", monospace',}}>
              Telemetria Solar Atual: <strong style={{ color: '#fff', fontFamily: '"Roboto Mono", monospace',}}>Kp {kpAtual}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* FAIXA MÉDIA DE TRANSIÇÃO */}
      <section style={{
        height: '220px', 
        background: `linear-gradient(to bottom, #000, transparent 20%, transparent 80%, #090909), url(${sol1}) no-repeat center/cover`,
        backgroundAttachment: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderTop: '1px solid #2d2d2d',
        borderBottom: '1px solid #2d2d2d'
      }}>
        <div style={{ background: 'rgba(0,0,0,0.7)', padding: '20px 40px', borderRadius: '8px', backdropFilter: 'blur(3px)', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '1.6rem', margin: '0 0 5x 0', color: '#fff', fontWeight: '300', fontFamily: '"Prompt", sans-serif',}}>A Litosfera em Observação</h2>
          <p style={{ color: '#ccc', maxWidth: '600px', margin: 0, fontSize: '0.95rem', fontFamily: '"Roboto Mono", monospace',}}>
            Explore abaixo a distribuição geomagnética e os eventos sísmicos ativos mapeados diretamente sobre a malha planetária.
          </p>
        </div>
      </section>

      {/* SEÇÃO DO GLOBO */}
      <TelaGlobo dadosSolares={dadosSolares} desacresNaturais={desastresNaturais} desastresNaturais={desastresNaturais} />

      {/* SEÇÃO COMPLEMENTAR: ANÁLISES (Gráficos integrados na rolagem) */}
      <div style={{ background: '#000', borderTop: '1px solid #2d2d2d' }}>
        <TelaAnalises dadosSolares={dadosSolares} desastresNaturais={desastresNaturais} />
      </div>

      {/* SEÇÃO COMPLEMENTAR: ARTIGOS CIENTÍFICOS */}
      <div style={{ background: '#090909', borderTop: '1px solid #2d2d2d', paddingBottom: '60px' }}>
        <TelaArtigos />
      </div>
    </div>
  );
}

function TelaGlobo({ dadosSolares, desastresNaturais }) {
  const [coordenadaClicada, setCoordenadaClicada] = useState(null);
  const [paisNome, setPaisNome] = useState("");
  const [carregandoPais, setCarregandoPais] = useState(false);
  const [filtroPaisInput, setFiltroPaisInput] = useState("");

  // Helper para remover acentos e maiúsculas permitindo busca inteligente global // já que a api está com os dados apenas em inglês
  const normalizarTexto = (texto) => {
    if (!texto) return "";
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  };

  const gerenciarCliqueNoGlobo = (lat, lng) => {
    setCoordenadaClicada({ lat, lng });
    setPaisNome("");
    setCarregandoPais(true);
    axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=3&accept-language=pt`)
      .then(res => {
        if (res.data.address && res.data.address.country) {
          setPaisNome(res.data.address.country);
          setFiltroPaisInput(res.data.address.country);
        } else { setPaisNome("Aguas Internacionais"); }
      })
      .catch(() => setPaisNome("Nao identificado"))
      .finally(() => setCarregandoPais(false));
  };

  const terremotosFiltrados = (desastresNaturais || []).filter(terremoto => {
    if (!filtroPaisInput) return true;
    const termoBusca = normalizarTexto(filtroPaisInput);
    const localTerremoto = normalizarTexto(terremoto.localizacao);
    return localTerremoto.includes(termoBusca);
  });

  const kpAtual = dadosSolares.length > 0 ? dadosSolares[0].indice_kp : "N/A";

  return (
    <section style={{ padding: '40px', display: 'flex', gap: '25px', boxSizing: 'border-box', background: '#000', maxWidth: '1200px', margin: '0 auto', justifyContent:'center'}}>
      <div style={{ flex: 1, background: '#000', borderRadius: '12px', border: '1px solid #2d2d2d', minHeight: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Globo3D dadosSolares={dadosSolares} desacresNaturais={terremotosFiltrados} desastresNaturais={terremotosFiltrados} aoClicarNoPais={gerenciarCliqueNoGlobo} />
      </div>
      <div style={{ width: '380px', background: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #2d2d2d', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ marginTop: 0, color: '#fff', fontFamily: '"Prompt", sans-serif',}}>Filtro Geografico</h3>
          <input 
            type="text" 
            placeholder="Busque por qualquer país (Ex: Japão)..." 
            value={filtroPaisInput}
            onChange={(e) => setFiltroPaisInput(e.target.value)}
            style={{ width: '90%', padding: '12px', borderRadius: '6px', border: '1px solid #444', background: '#2b2b2b', color: '#fff', fontSize: '1rem' }}
          />
          {filtroPaisInput && (
            <button onClick={() => { setFiltroPaisInput(""); setCoordenadaClicada(null); }} style={{ marginTop: '10px', background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold', fontFamily: '"Roboto Mono", monospace',}}>
              Limpar Filtro
            </button>
          )}
        </div>
        
        <hr style={{ borderColor: '#2d2d2d', margin: 0 }} />
        
        <div>
          <h3 style={{ color: '#fff', marginTop: 0 , fontFamily: '"Roboto Mono", monospace',}}>Dados da Região</h3>
          {filtroPaisInput ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' , fontFamily: '"Roboto Mono", monospace',}}>
              <p style={{ margin: 0 }}>País Identificado: <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{filtroPaisInput}</strong></p>
              
              {/* Telemetria de Radiação / Vento Solar via Kp */}
              <div style={{ background: '#252525', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #ffb703', fontFamily: '"Roboto Mono", monospace',}}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#ffb703', fontFamily: '"Roboto Mono", monospace',}}>Incidência Geomagnética (Radiação)</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc', fontFamily: '"Roboto Mono", monospace',}}>
                  O índice Kp global atual é <strong>Kp {kpAtual}</strong>. 
                  {Number(kpAtual) >= 5 ? " Alerta de perturbação ionosférica severa sobre a malha territorial." : " Níveis de fluxo e radiação dentro da normalidade magnética."}
                </p>
              </div>

              {/* Registro cumulativo de Eventos Sísmicos na área buscada */}
              <div style={{ background: '#252525', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #00d2ff' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#00d2ff' }}>Eventos Sísmicos Coletados</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc' }}>
                  Encontrados: <strong style={{ color: '#fff' }}>{terremotosFiltrados.length} evento(s) sismológicos</strong>
                </p>
                {terremotosFiltrados.length > 0 && (
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '15px', fontSize: '0.8rem', color: '#aaa', maxHeight: '150px', overflowY: 'auto' }}>
                    {terremotosFiltrados.map((t, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>
                        Magnitude: <strong style={{ color: '#ff4d4d' }}>{t.magnitude}M</strong> <br />
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>{t.localizacao}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div>
              {coordenadaClicada && (
                <p style={{ margin: '0 0 10px 0' }}>Local: <strong style={{ color: '#ffb703' }}>{carregandoPais ? "Buscando..." : paisNome}</strong></p>
              )}
              <p style={{ color: '#666', fontStyle: 'italic', margin: 0, fontFamily: '"Roboto Mono", monospace',}}>
                Digite o nome de um país ou clique diretamente no globo para cruzar e inspecionar os relatórios de eventos e radiação.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TelaAnalises({ dadosSolares, desacresNaturais, desabrasNaturais, desastresNaturais }) {
  const listaTerremotos = desastresNaturais || desacresNaturais || [];

  const calcularKpPrecedente = (dataTerremotoStr) => {
    const dataTerremoto = new Date(dataTerremotoStr);
    const registrosNaJanela = dadosSolares.filter(solar => {
      const dataSolar = new Date(solar.data_hora);
      return dataSolar <= dataTerremoto && dataSolar >= new Date(dataTerremoto.getTime() - 96*60*60*1000);
    });
    const maxKp = registrosNaJanela.length > 0 ? Math.max(...registrosNaJanela.map(s => s.indice_kp)) : (dadosSolares[0]?.indice_kp || 0);
    return { maxKp, houveTempestade: maxKp >= 5 };
  };

  const dadosGrafico = listaTerremotos.slice(0, 10).map(t => {
    const analise = calcularKpPrecedente(t.data_hora);
    return { local: t.localizacao ? t.localizacao.split(',').pop().trim() : 'N/A', Magnitude: t.magnitude, Kp_Precedente: analise.maxKp };
  }).reverse();

  return (
    <section style={{ padding: '40px', boxSizing: 'border-box', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginTop: 0, fontFamily: '"Prompt", sans-serif',}}>Análise de Impacto Geomagnetico</h2>
      <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '0.95rem', fontFamily: '"Roboto Mono", monospace',}}>Cruzamento estatistico entre a magnitude dos abalos e o estresse solar acumulado nas horas anteriores.</p>
      
      {/*CONTÊINER FLEXBOX PAI, COLOCA O GRÁFICO E A LEGENDA LADO A LADO E CENTRALIZADOS */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', gap: '25px', width: '100%' }}>
        
        {/* BLOCO DO GRÁFICO */}
        <div style={{ flex: 2, background: '#1e1e1e', padding: '20px', borderRadius: '12px', border: '1px solid #2d2d2d', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dadosGrafico}>
              <CartesianGrid stroke="#2d2d2d" />
              <XAxis dataKey="local" stroke="#aaa" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#636E72" fontSize={11} label={{ value: 'Magnitude (M)', angle: -90, position: 'insideLeft', fill: '#636E72', offset: 0 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#A86A44" domain={[0, 9]} fontSize={11} label={{ value: 'Indice Kp Precedente', angle: 90, position: 'insideRight', fill: '#A86A44', offset: 0 }} />
              <Tooltip contentStyle={{ backgroundColor: '#2b2b2b', color: '#fff', border: '1px solid #444' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="Magnitude" fill="#636E72" radius={[4, 4, 0, 0]} name="Magnitude do Terremoto (Escala Richter)" barSize={25} />
              <Line yAxisId="right" type="monotone" dataKey="Kp_Precedente" stroke="#A86A44" strokeWidth={2.5} name="Indice Kp Maximo Registrado" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* BLOCO DE LEGENDAS*/}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '15px', background: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #2d2d2d' }}>
          <div>
            <h4 style={{ color: '#636E72', margin: '0 0 6px 0', fontSize: '0.9rem', fontFamily: '"Roboto Mono", monospace',}}> Magnitude (M)</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc', lineHeight: '1.4', fontFamily: '"Roboto Mono", monospace',}}>
              Energia liberada na crosta. Valores acima de <strong>5.0M</strong> indicam abalos moderados a fortes com potencial de danos estruturais na região.
            </p>
          </div>
          <hr style={{ borderColor: '#2d2d2d', margin: '5px 0' }} />
          <div>
            <h4 style={{ color: '#A86A44', margin: '0 0 6px 0', fontSize: '0.9rem', fontFamily: '"Roboto Mono", monospace',}}> Índice Kp Precedente</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc', lineHeight: '1.4', fontFamily: '"Roboto Mono", monospace',}}>
              Medição global da perturbação magnética nas 96h anteriores ao abalo.<br />
              • <strong>Kp 0 a 3:</strong> Calmaria Geofísica.<br />
              • <strong>Kp 4:</strong> Alerta ativo.<br />
              • <strong>Kp 5 ou +:</strong> Tempestade Geomagnética.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function TelaArtigos() {
  return (
    <section style={{ padding: '50px 40px', maxWidth: '1350px', margin: '0 auto', boxSizing: 'border-box' }}>
      <h2 style={{ color: '#fff', marginTop: 0, fontSize: '2.2rem', textAlign: 'center', fontFamily: '"Prompt", sans-serif',}}>Literatura Científica de Referência</h2>
      <p style={{ color: '#aaa', marginBottom: '45px', fontSize: '1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto 45px auto', fontFamily: '"Roboto Mono", monospace',}}>
        Análise detalhada acerca dos impactos diretos das emissões e variações heliofísicas sobre a fisiologia cardiovascular humana e a dinâmica não-linear de falhas tectônicas na crosta terrestre.
      </p>
      
      {/* CONTÊINER LAYOUT LADO A LADO */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', gap: '30px', width: '100%' }}>
        
        {/* TEXTO COLUNA 1: CORPO HUMANO */}
        <div style={{ flex: 1, background: '#1e1e1e', padding: '35px', borderRadius: '12px', border: '1px solid #2d2d2d', display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#2A353A', margin: 0, fontSize: '1.25rem', fontWeight: '600', fontFamily: '"Roboto Mono", monospace',}}>Distúrbios Geomagnéticos e Casos de Infarto</h3>
              <span style={{ fontSize: '0.7rem', color: '#2A353A', border: '1px solid #2A353A', padding: '3px 10px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '0.5px', fontFamily: '"Roboto Mono", monospace',}}>CORPO HUMANO</span>
            </div>
            
            <p style={{ margin: '0 0 15px 0', color: '#ccc', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify', fontFamily: '"Roboto Mono", monospace',}}>
              Pesquisas médicas vêm revelando dados estatísticos surpreendentes que conectam o clima espacial à saúde pública. Um estudo epidemiológico detalhado, que analisou o banco de dados hospitalar do município de São José dos Campos (SP) ao longo de um extenso período entre 1998 e 2005, mapeou as admissões por infarto agudo do miocárdio em paralelo direto com as oscilações do <strong>Índice Geomagnético Planetário (Kp)</strong>. Os dados revelaram que as variações no fluxo de vento solar impactam os sistemas regulatórios biológicos de forma profunda.
            </p>
            
            <p style={{ margin: '0 0 15px 0', color: '#b5b5b5', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify', fontFamily: '"Roboto Mono", monospace',}}>
              A pesquisa apontou uma assimetria demográfica intrigante: embora os homens apresentem historicamente o dobro do volume bruto de eventos cardiovasculares gerais, a <strong>frequência relativa de episódios cardíacos em mulheres sofre uma elevação estatisticamente significativa nos dias sob efeito de severas tempestades magnéticas</strong>. Esse comportamento sugere uma sensibilidade diferenciada às correntes induzidas e variações de baixa frequência na magnetosfera terrestre.
            </p>
            
            <p style={{ margin: '0 0 20px 0', color: '#aaa', lineHeight: '1.7', fontSize: '0.9rem', fontStyle: 'italic', background: '#141414', padding: '15px', borderRadius: '6px', borderLeft: '3px solid #2A353A', fontFamily: '"Roboto Mono", monospace',}}>
              "Os achados científicos indicam que flutuações eletromagnéticas ambientais agem como estressores sistêmicos sutis, capazes de desestabilizar o tônus autonômico cardiovascular, alterando a viscosidade sanguínea e a homeostase em indivíduos biologicamente predispostos."
            </p>
          </div>

          {/* REFERÊNCIAS COLUNA 1 */}
          <div style={{ borderTop: '1px solid #333', paddingTop: '15px', marginTop: '10px' }}>
            <h4 style={{ color: '#2A353A', margin: '0 0 8px 0', fontSize: '0.85rem', letterSpacing: '0.5px' }}>REFERÊNCIAS BIBLIOGRÁFICAS</h4>
            <p style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: '#aaa', lineHeight: '1.4', fontFamily: '"Roboto Mono", monospace',}}>
              MENDONÇA, M. A. et al. <strong>Análise Epidemiológica dos Casos de Infarto Agudo do Miocárdio e sua Correlação com a Atividade Geomagnética Planetária (1998-2005)</strong>. São José dos Campos: INPE / Univap, 2023.
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#888', lineHeight: '1.4', fontFamily: '"Roboto Mono", monospace',}}>
              CNN BRASIL. <em>Distúrbios geomagnéticos gerados pelo Sol influenciam casos de infarto, diz estudo brasileiro</em>. Disponível em: &lt;https://www.cnnbrasil.com.br/saude/&gt;.
            </p>
          </div>
        </div>

        {/*GATILHOS GEOLÓGICOS */}
        <div style={{ flex: 1, background: '#1e1e1e', padding: '35px', borderRadius: '12px', border: '1px solid #2d2d2d', display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'space-between', fontFamily: '"Roboto Mono", monospace',}}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#3A322A', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>O Papel do Calor Solar na Atividade Sísmica</h3>
              <span style={{ fontSize: '0.7rem', color: '#3A322A', border: '1px solid #3A322A', padding: '3px 10px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '0.5px' }}>GATILHOS TECTÔNICOS</span>
            </div>
            
            <p style={{ margin: '0 0 15px 0', color: '#ccc', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
              No âmbito da geofísica pura, um estudo de fronteira publicado na conceituada revista científica <em>Chaos: An Interdisciplinary Journal of Nonlinear Science</em> propôs solucionar um dos maiores enigmas da geologia moderna: o gatilho inicial que desencadeia terremotos em falhas tectônicas já tensionadas. Utilizando métodos de análise de dados massivos e models computacionais avançados de dinâmica não-linear, pesquisadores demonstraram uma sólida correlação entre os ciclos solares de longo período e a atividade sísmica do planeta.
            </p>
            
            <p style={{ margin: '0 0 15px 0', color: '#b5b5b5', lineHeight: '1.7', fontSize: '0.95rem', textAlign: 'justify' }}>
              O cerne da descoberta fundamenta-se no papel do fluxo de calor e energia injetados pela radiação e partículas solares, que desestabilizam o balanço de forças microscópicas nas camadas superiores e profundas da crosta. Ao invés de uma força mecânica direta e imediata, as flutuações térmicas e geomagnéticas atuam de forma cumulativa, agindo como um modulador sutil que altera as propriedades mecânicas e a fricção estática das rochas em pontos críticos de falhas.
            </p>
            
            <p style={{ margin: '0 0 20px 0', color: '#aaa', lineHeight: '1.7', fontSize: '0.9rem', fontStyle: 'italic', background: '#141414', padding: '15px', borderRadius: '6px', borderLeft: '3px solid #3A322A' }}>
              "Ao decodificar as dinâmicas não-lineares terra-espaço, o estudo introduz modelos preditivos promissores. A convergência entre o monitoramento da heliosfera e as tensões litosféricas pavimenta o caminho para algoritmos preditivos de desastres mais eficientes."
            </p>
          </div>

          {/* REFERÊNCIAS COLUNA 2 */}
          <div style={{ borderTop: '1px solid #333', paddingTop: '15px', marginTop: '10px' }}>
            <h4 style={{ color: '#3A322A', margin: '0 0 8px 0', fontSize: '0.85rem', letterSpacing: '0.5px' }}>REFERÊNCIAS BIBLIOGRÁFICAS</h4>
            <p style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: '#aaa', lineHeight: '1.4' }}>
              MARCH, S. et al. <strong>The role of solar heat and non-linear dynamics in earth’s seismic activity stimulation</strong>. <em>Chaos: An Interdisciplinary Journal of Nonlinear Science</em>, Melville, v. 35, n. 3, mar. 2025.
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#888', lineHeight: '1.4' }}>
              FORBES TECH. <em>Novo estudo revela conexão surpreendente entre o Sol e terremotos na Terra</em>. Disponível em: &lt;https://forbes.com.br/forbes-tech/&gt;.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

// ESTILOS GLOBAIS REUTILIZADOS
const estiloLinkMenu = {
  color: '#aaa',
  textDecoration: 'none',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  fontSize: '0.85rem'
};