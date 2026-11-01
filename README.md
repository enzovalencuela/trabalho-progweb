# E-Commerce Gamer (Full Stack & Containerizado)

Este repositório contém uma aplicação completa de E-Commerce voltada para o segmento gamer, composta por uma Single Page Application (SPA) em React no front-end e uma API REST em Spring Boot no back-end. Todo o ecossistema é totalmente containerizado utilizando Docker e orquestrado via Docker Compose.

---

## Arquitetura do Sistema

A solução adota uma arquitetura em microsserviços/módulos independentes:

* **Front-end**: React, Vite, TypeScript, Tailwind CSS e Nginx.
* **Back-end**: Java 17, Spring Boot, Spring Data JPA, Spring Security e Firebase Admin SDK.
* **Banco de Dados**: PostgreSQL.
* **Containerização**: Docker e Docker Compose para padronização de ambiente de desenvolvimento e produção.

---

## Estrutura do Repositório

```text
.
├── back/                   # API REST em Java / Spring Boot
│   ├── src/                # Código-fonte (Controllers, Services, Entidades, DTOs)
│   ├── Dockerfile          # Build multi-stage da aplicação Java (Maven -> JRE)
│   └── pom.xml             # Dependências do projeto Maven
├── front/                  # Aplicação web React / Vite
│   ├── src/                # Componentes, Páginas, Contextos e Hooks
│   ├── nginx/              # Configuração do servidor HTTP Nginx
│   └── Dockerfile          # Build multi-stage da SPA (Node -> Nginx)
├── .env.example            # Modelo unificado de variáveis de ambiente
├── docker-compose.yml      # Orquestração de todos os serviços (Db, Back, Front)
└── README.md               # Documentação principal do projeto

```

---

## Tecnologias Utilizadas

### Front-end

* React (TypeScript)
* Vite
* Tailwind CSS
* Lucide React / Componentes UI
* Firebase Authentication (SDK Client)
* Nginx (Servidor de arquivos estáticos em ambiente containerizado)

### Back-end

* Java 17
* Spring Boot
* Spring Data JPA (Hibernate)
* Spring Security (Integração com tokens Firebase JWT)
* Jackson JSON (Serialização customizada de propriedades)
* Maven

### Infraestrutura

* PostgreSQL
* Docker & Docker Compose

---

## Como Executar a Aplicação

### Pré-requisitos

* Docker instalado (com o plugin Docker Compose ativo)
* Git

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/enzovalencuela/trabalho-progweb.git
cd trabalho-progweb

```

### Passo 2: Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto copiando a estrutura fornecida em `.env.example`:

```bash
cp .env.example .env

```

Abra o arquivo `.env` e preencha as credenciais necessárias (banco de dados, Firebase e chaves de pagamento, se aplicável).

### Passo 3: Subir a Aplicação com Docker Compose

Execute o comando de build e inicialização dos containers:

```bash
docker compose up --build -d

```

O Docker Compose iniciará automaticamente:

1. O banco de dados PostgreSQL na porta `5432`.
2. O back-end Spring Boot na porta `8081`.
3. O front-end servido via Nginx na porta `5173` (ou `80`).

---

## Endpoints Principais (API REST)

* `GET /api/products`: Lista todos os produtos cadastrados no catálogo.
* `GET /api/products/{id}`: Retorna os detalhes de um produto específico.
* `GET /api/reviews/summary`: Obtém o resumo de avaliações gerais.
* `POST /api/cart`: Gerencia os itens no carrinho de compras.
* `POST /api/sales`: Processa a finalização de um pedido de compra.

---

## Acessando os Serviços Localmente

* **Front-end Web**: `http://localhost:5173`
* **Back-end API**: `http://localhost:8081`
* **Banco de Dados**: `localhost:5432`

---

## Comandos Úteis do Docker

* **Visualizar logs dos containers**:
```bash
docker compose logs -f

```


* **Parar a aplicação**:
```bash
docker compose down

```


* **Parar e remover volumes de dados (resetar o banco)**:
```bash
docker compose down -v
