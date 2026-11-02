# NEXGEN - E-Commerce Gamer (Full Stack & Containerizado)

Uma plataforma completa de e-commerce voltada para o público gamer, desenvolvida com uma SPA moderna em React no front-end, uma API REST robusta em Spring Boot 3 no back-end e banco de dados PostgreSQL. Todo o ecossistema é 100% containerizado com Docker e orquestrado via Docker Compose, contando com gerenciamento visual via pgAdmin4 e um Gateway de Pagamento Próprio Simulado (White-label).

---

## Arquitetura do Sistema

A aplicação adota uma arquitetura em microsserviços/módulos independentes e isolados:

- **Front-end**: React (Vite, TypeScript, Tailwind CSS) servido via **Nginx** em ambiente containerizado.
- **Back-end**: Java 17, **Spring Boot 3**, Spring Data JPA, Spring Security e Firebase Admin SDK.
- **Banco de Dados**: **PostgreSQL 17** com persistência em volume Docker.
- **Gerenciamento do BD**: **pgAdmin 4** integrado ao ecossistema para administração visual de dados.
- **Pagamentos**: Gateway de Pagamento Próprio Simulado (sem dependência de APIs externas).

---

## Estrutura do Repositório

```text
.
├── back/                   # API REST em Java / Spring Boot 3
│   ├── src/                # Controllers, Services, Repositories, Entities e DTOs
│   │   └── main/resources/ # application.properties e data.sql (Carga Inicial)
│   ├── Dockerfile          # Build multi-stage da aplicação Java (Maven -> JRE)
│   └── pom.xml             # Gerenciador de dependências Maven
├── front/                  # Aplicação web React / Vite
│   ├── src/                # Componentes, Páginas, Contextos e Hooks UI
│   ├── nginx/              # Configuração do servidor HTTP Nginx
│   └── Dockerfile          # Build multi-stage da SPA (Node -> Nginx)
├── .env.example            # Modelo de variáveis de ambiente
├── docker-compose.yml      # Orquestração (Db, pgAdmin, Backend, Frontend)
└── README.md               # Documentação principal do projeto
```

---

## Tecnologias Utilizadas

### Front-end

- **React 18** com **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Estilização)
- **Lucide React & FontAwesome** (Iconografia)
- **Firebase Auth Client SDK** (Autenticação Google)
- **Nginx** (Web Server em produção)

### Back-end

- **Java 17** & **Spring Boot 3.x**
- **Spring Security** (Autenticação stateless baseada em token)
- **Spring Data JPA / Hibernate** (ORM e persistência)
- **Jackson JSON** (Serialização de propriedades)
- **Maven** (Gerenciador de dependências e build)

### Infraestrutura & Banco

- **PostgreSQL 17**
- **pgAdmin 4**
- **Docker** & **Docker Compose**

---

## Guia Passo a Passo: Como Executar a Aplicação

### Pré-requisitos

- **Docker Desktop** (com o plugin Docker Compose ativo).
- **Git**.

---

### 1. Clonar o Repositório

```bash
git clone https://github.com/enzovalencuela/trabalho-progweb.git
cd trabalho-progweb
```

---

### 2. Configurar as Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto a partir do modelo `.env.example`:

```bash
cp .env.example .env
```

Para desenvolvimento local com o Docker Compose, as credenciais padrão do `.env` já estão pré-configuradas. Caso necessário, ajuste os valores:

```env
# Banco de Dados PostgreSQL
POSTGRES_DB=ecommerce_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# URLs da Aplicação
VITE_BACKEND_URL=http://localhost:8081
DATABASE_URL=jdbc:postgresql://db:5432/ecommerce_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres123

# Credenciais Firebase (Se aplicável)
VITE_FIREBASE_API_KEY=seu_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

---

### 3. Subir os Containers Docker

Execute o comando para compilar e iniciar todos os 4 containers em segundo plano:

```bash
docker compose up --build -d
```

#### Containers Inicializados:

| Serviço      | Container Name       | Porta Host  | Descrição                               |
| :----------- | :------------------- | :---------- | :-------------------------------------- |
| **Database** | `projeto-db-1`       | `5432:5432` | Instância do PostgreSQL 17              |
| **pgAdmin**  | `projeto-pgadmin-1`  | `5050:80`   | Interface gráfica web para o PostgreSQL |
| **Backend**  | `projeto-backend-1`  | `8081:8081` | API REST Spring Boot 3                  |
| **Frontend** | `projeto-frontend-1` | `5173:80`   | Single Page Application em React/Nginx  |

---

### 4. Popular o Banco de Dados PostgreSQL (Carga Inicial)

Para que a loja exiba produtos e o histórico de compras de teste, você pode popular o banco de dados de **duas maneiras**:

#### Método A: Povoamento Automático via Spring Boot (Recomendado)

O Spring Boot já está configurado para ler o script `back/src/main/resources/data.sql` e popular as tabelas assim que o banco de dados for inicializado pela primeira vez.

#### Método B: Importação Visual via pgAdmin 4

Se precisar recriar ou injetar os dados manualmente:

1. Acesse o pgAdmin no navegador: [http://localhost:5050](http://localhost:5050)
2. Faça login com as credenciais padrão:
   - **E-mail**: `admin@admin.com`
   - **Senha**: `admin`
3. Conecte ao PostgreSQL:
   - Clique em **Add New Server**.
   - Na aba **General**, defina o Name como `PostgreSQL Local`.
   - Na aba **Connection**:
     - **Host name/address**: `db` _(usar o nome do container no Docker)_
     - **Port**: `5432`
     - **Maintenance database**: `ecommerce_db`
     - **Username**: `postgres`
     - **Password**: `postgres123`
   - Clique em **Save**.
4. Importar o SQL:
   - Clique com o botão direito no banco `ecommerce_db` -> **Query Tool**.
   - Abra o arquivo `back/src/main/resources/data.sql`, cole o conteúdo no editor e pressione **`F5`** (ou clique no botão **Play**).

---

## Testando o Fluxo de Checkout Simulado

O sistema utiliza um **Gateway de Pagamento Próprio (White-label)** que simula compras completas sem dependências de chaves externas de sandbox:

1. Acesse o Front-end em [http://localhost:5173](http://localhost:5173).
2. Faça login (usando uma conta de teste ou autenticação via Google).
3. Adicione produtos ao carrinho e navegue até a tela de **Checkout**.
4. Escolha entre **Cartão de Crédito/Débito** ou **Pix**.
5. Clique em **Finalizar Pagamento**:
   - O valor real dos itens no PostgreSQL será somado.
   - A transação será gravada com o status `"APPROVED"` ou `"PENDING"`.
   - Os itens serão removidos do carrinho e associados ao histórico do usuário.
6. Acesse a página **"Minhas Compras"** no menu do usuário para visualizar os pedidos salvos, datas, itens comprados e o status da transação em verde/aprovado.

---

## Endpoints Principais da API REST (`http://localhost:8081`)

### Produtos & Catálogo

- `GET /api/products` - Lista todos os produtos do catálogo.
- `GET /api/products/{id}` - Obtém os detalhes de um produto específico.
- `GET /api/products/category/{category}` - Filtra produtos por categoria.

### Carrinho de Compras

- `GET /api/cart/{userId}` - Retorna os produtos no carrinho do usuário.
- `POST /api/cart/add` - Adiciona um produto ao carrinho.
- `POST /api/cart/remove` - Remove um produto do carrinho.

### Pagamentos & Histórico

- `POST /api/payments/create` - Cria um pagamento simulado e calcula o valor real no PostgreSQL.
- `GET /api/payments/status?payment_id={id}` - Consulta o comprovante e os detalhes de um pagamento.
- `GET /api/payments/user/{userId}` - Retorna o histórico completo de compras do usuário.
- `POST /api/payments/{id}/approve` - Altera o status do pagamento para Aprovado (Simulação).
- `POST /api/payments/{id}/cancel` - Altera o status do pagamento para Cancelado (Simulação).

### Autenticação & Sessão

- `GET /api/session` - Recupera os dados da sessão do usuário autenticado.
- `POST /api/auth/google` - Autentica/Cadastra o usuário via Google token no PostgreSQL.
- `POST /api/logout` - Encerra a sessão ativa.

---

## Solução de Problemas (Troubleshooting)

### 1. Erro de conexão com o Banco de Dados no Spring Boot

Se a API Java falhar ao subir informando que não conseguiu conectar no PostgreSQL:

- Verifique se o container `db` está saudável rodando `docker compose ps`.
- Verifique os logs do banco com `docker logs projeto-db-1`.

### 2. Resetar o ambiente e banco de dados do zero

Se o banco de dados ficar corrompido ou quiser limpar todas as transações de teste:

```bash
# Para todos os containers e remove os volumes de dados
docker compose down -v

# Reconstrói os containers e aplica o data.sql limpo novamente
docker compose up --build -d
```

### 3. Erro de CORS no Front-end ao chamar a API

- Verifique se o `VITE_BACKEND_URL` no seu arquivo `.env` está apontando para `http://localhost:8081`.
- Certifique-se de que o container do `backend` foi reconstruído após alterações nas variáveis (`docker compose up --build -d`).

---

## Desenvolvido por

Projeto desenvolvido para a disciplina de Programação Web.
