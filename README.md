# Projeto Tempestades Solares
Este projeto foi desenvolvido com base em estudos científicos que analisam como as tempestades solares podem interferir no corpo humano e em desastres naturais. A aplicação consome a API da NOAA em tempo real para monitorar a atividade solar e comparar esses dados com desastres terrestres, como terremotos, exibindo em tempo real os fenômenos que estão acontecendo no momento.

---

## Tecnologias Utilizadas

### Backend
* **Python** (v3.14+)
* **Django** & **Django REST Framework** (API robusta e segura)
* **Python-dotenv** (Gerenciamento de variáveis de ambiente)
* **Django CORS Headers** (Integração segura com o Frontend)

### Frontend
* **React** (Vite)
* **TypeScript**
* **Tailwind CSS**
* **React Router Dom**
* **Recharts** (Visualização de Dados)
* **Axios** (Integração HTTP)
* **React-Globe.gl / Three.js** (Globo 3D Interativo)

### APIs & Fontes Científicas
* **NOAA API** (Dados de Clima Espacial / Índice Kp)
* **USGS API** (Dados Sismológicos Mundiais)
* **Nominatim / OpenStreetMap API** (Geocodificação Reversa)

---

## Estrutura do Projeto

```text
📂 temp-solares/
├── 📂 backend/           # API Django (Python)
├── 📂 frontend/          # Interface React (Vite)
├── 📄 .gitignore         # Arquivos ignorados pelo Git
└── 📄 README.md          # Documentação do projeto
