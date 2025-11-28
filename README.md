# Price-Wise Fullstack

<div align="center">

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.8-brightgreen?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

Sistema completo de e-commerce com gerenciamento de produtos, cupons de desconto e pedidos. Desenvolvido com Spring Boot no backend e React no frontend.

[Funcionalidades](#funcionalidades) •
[Tecnologias](#tecnologias) •
[Instalação](#instalação) •
[Uso](#uso) •
[API](#documentação-da-api) •
[Contribuir](#contribuindo)

</div>

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso](#uso)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Sobre o Projeto

Price Wise é uma aplicação fullstack de e-commerce que oferece um sistema robusto para gerenciamento de produtos, aplicação de cupons de desconto e controle de pedidos. O projeto foi desenvolvido com foco em boas práticas de desenvolvimento, arquitetura limpa e experiência do usuário.

### Principais Características

- **Autenticação JWT** - Sistema completo de login e registro
- **Gestão de Produtos** - CRUD completo com filtros avançados
- **Sistema de Cupons** - Cupons de desconto por percentual ou valor fixo
- **Carrinho de Compras** - Gestão de itens e aplicação de descontos
- **Dashboard Interativo** - Métricas e estatísticas em tempo real
- **Controle de Acesso** - Roles de usuário (USER/ADMIN)
- **Interface Responsiva** - Design moderno com Tailwind CSS
- **Containerizado** - Pronto para deploy com Docker

---

## Funcionalidades

### Backend (API REST)

#### Autenticação

- Registro de novos usuários
- Login com JWT
- Controle de acesso baseado em roles (USER/ADMIN)
- Proteção de rotas sensíveis

#### Produtos

- Criar, editar e listar produtos
- Filtros por nome, preço e categoria
- Paginação e ordenação
- Controle de estoque
- Soft delete (exclusão lógica)
- Validação de disponibilidade

#### Cupons

- Criar cupons de desconto
- Tipos: percentual (`percent`) ou fixo (`fixed`)
- Validade configurável
- Cupons de uso único (`oneShot`)
- Validação de expiração

#### Pedidos

- Criar pedidos com múltiplos produtos
- Aplicar cupons automaticamente
- Cálculo de descontos
- Validações de negócio:
  - Cupom expirado → `400 Bad Request`
  - Cupom inexistente → `404 Not Found`
  - Produto sem estoque → `400 Bad Request`
  - Cupom oneShot reutilizado → `409 Conflict`
  - Valor final < R$ 0,01 → `422 Unprocessable Entity`

#### Dashboard

- Total de produtos cadastrados
- Total de pedidos realizados
- Receita total
- Descontos aplicados
- Produtos com estoque baixo
- Total de cupons ativos

### Frontend (React)

- **Dashboard** - Visão geral com métricas
- **Produtos** - Listagem com filtros e busca
- **Cupons** - Gerenciamento de cupons
- **Pedidos** - Histórico e detalhes
- **Checkout** - Finalização de compras
- **Login/Registro** - Autenticação de usuários
- **Loading States** - Feedback visual durante requisições
- **Tratamento de Erros** - Mensagens amigáveis

---

## Tecnologias

### Backend

| Tecnologia            | Versão  | Descrição                        |
| --------------------- | ------- | -------------------------------- |
| **Java**              | 21      | Linguagem de programação         |
| **Spring Boot**       | 3.5.8   | Framework backend                |
| **Spring Security**   | 6.4.5   | Autenticação e autorização       |
| **Spring Data JPA**   | 3.5.8   | Persistência de dados            |
| **JWT (jjwt)**        | 0.12.5  | Tokens de autenticação           |
| **PostgreSQL**        | 16+     | Banco de dados (produção)        |
| **H2 Database**       | -       | Banco de dados (desenvolvimento) |
| **Lombok**            | 1.18.30 | Redução de boilerplate           |
| **SpringDoc OpenAPI** | 2.3.0   | Documentação Swagger             |
| **Maven**             | 3.9+    | Gerenciamento de dependências    |

### Frontend

| Tecnologia       | Versão | Descrição           |
| ---------------- | ------ | ------------------- |
| **React**        | 19.1.0 | Biblioteca UI       |
| **Vite**         | 7.0.3  | Build tool          |
| **React Router** | 7.1.1  | Roteamento          |
| **Axios**        | 1.7.9  | Cliente HTTP        |
| **Tailwind CSS** | 4.1.11 | Estilização         |
| **Vitest**       | 2.1.8  | Framework de testes |
| **ESLint**       | 9.17.0 | Linter              |

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **GitHub Actions** - CI/CD
- **Nginx** - Servidor web (frontend)

---

## Arquitetura

### Backend - Estrutura de Pacotes

```
backend/src/main/java/com/example/price_wise_fullstack/
├── config/           # Configurações (Swagger, etc)
├── controller/       # Endpoints REST
├── dto/             # Data Transfer Objects
├── mapper/          # Conversão entre DTOs e entidades
├── model/           # Entidades JPA
├── repository/      # Interfaces de persistência
├── security/        # Configurações de segurança e JWT
└── service/         # Lógica de negócios
```

### Frontend - Estrutura de Diretórios

```
frontend/src/
├── components/      # Componentes reutilizáveis
├── contexts/        # Contextos React (Auth)
├── pages/          # Páginas da aplicação
├── services/       # Serviços de API
└── assets/         # Arquivos estáticos
```

### Banco de Dados - Modelo de Dados

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Product   │       │    Order    │       │   Coupon    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ name        │       │ totalOrig   │       │ code        │
│ description │       │ discountApp │       │ type        │
│ price       │       │ totalFinal  │       │ discValue   │
│ stock       │◄──┐   │ createdAt   │   ┌──►│ oneShot     │
│ createdAt   │   │   │ coupon_id   │───┘   │ validFrom   │
│ updatedAt   │   │   └─────────────┘       │ validUntil  │
│ deletedAt   │   │                         │ createdAt   │
└─────────────┘   │   ┌─────────────┐       │ updatedAt   │
                  │   │  OrderItem  │       │ deletedAt   │
                  │   ├─────────────┤       └─────────────┘
                  │   │ id          │
                  │   │ order_id    │       ┌─────────────┐
                  └───│ product_id  │       │    User     │
                      │ price       │       ├─────────────┤
                      │ quantity    │       │ id          │
                      └─────────────┘       │ name        │
                                            │ email       │
                                            │ password    │
                                            │ role        │
                                            │ active      │
                                            │ createdAt   │
                                            │ updatedAt   │
                                            └─────────────┘
```

---

## Instalação

### Pré-requisitos

- **Docker** - [Download](https://www.docker.com/)
- **Docker Compose** - Incluído no Docker Desktop

### Instalação com Docker (Recomendado)

#### 1. Clone o repositório

```bash
git clone https://github.com/nevesmarcos42/price-wise-fullstack.git
cd price-wise-fullstack
```

#### 2. Inicie a aplicação

```bash
docker-compose up -d
```

Pronto! A aplicação estará rodando em:

- **Frontend**: `http://localhost`
- **Backend API**: `http://localhost:8080`
- **PostgreSQL**: `localhost:5432`

#### 3. Verificar status dos containers

```bash
docker-compose ps
```

#### 4. Parar a aplicação

```bash
docker-compose down
```

---

## Arquitetura Docker

### Containers

A aplicação é composta por 3 containers:

1. **pricewise-db** - PostgreSQL 16
2. **pricewise-backend** - Spring Boot (Java 21)
3. **pricewise-frontend** - React + Nginx

### Volumes

- `postgres_data` - Persistência do banco de dados

### Network

- `pricewise-network` - Comunicação entre containers

---

## Uso

### Primeiro Acesso

1. **Acesse a aplicação**: `http://localhost:5173` (ou porta 80 se usando Docker)

2. **Crie uma conta**:

   - Clique em "Criar Conta"
   - Preencha nome, email e senha
   - Faça login com as credenciais criadas

3. **Usuário Admin** (para testes):
   - O primeiro usuário pode ser promovido a admin diretamente no banco
   - Ou crie via API com role "ADMIN"

### Funcionalidades Principais

#### Gerenciar Produtos

```bash
# Como ADMIN
1. Acesse "Produtos"
2. Clique em "Novo Produto"
3. Preencha nome, descrição, preço e estoque
4. Salve
```

#### Criar Cupons

```bash
# Como ADMIN
1. Acesse "Cupons"
2. Clique em "Novo Cupom"
3. Escolha tipo (percent/fixed)
4. Defina valor e validade
5. Marque "Uso único" se necessário
```

#### Fazer um Pedido

```bash
# Como USER ou ADMIN
1. Acesse "Checkout"
2. Adicione produtos ao carrinho
3. Aplique um cupom
4. Finalize o pedido
```

#### Visualizar Dashboard

```bash
1. Acesse "Dashboard"
2. Veja métricas em tempo real:
   - Total de produtos
   - Pedidos realizados
   - Receita total
   - Produtos com estoque baixo
```

---

## Documentação da API

A documentação interativa está disponível via **Swagger UI** após iniciar o backend:

**URL**: `http://localhost:8080/swagger-ui.html`

### Principais Endpoints

#### Autenticação

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
```

#### Produtos

```http
GET    /api/v1/products          # Listar (público)
POST   /api/v1/products          # Criar (ADMIN)
GET    /api/v1/products/{id}     # Buscar por ID
PUT    /api/v1/products/{id}     # Atualizar (ADMIN)
DELETE /api/v1/products/{id}     # Deletar (ADMIN)
```

#### Cupons

```http
GET    /api/v1/coupons           # Listar
POST   /api/v1/coupons           # Criar (ADMIN)
GET    /api/v1/coupons/{id}      # Buscar por ID
DELETE /api/v1/coupons/{id}      # Deletar (ADMIN)
```

#### Pedidos

```http
GET    /api/v1/orders            # Listar
POST   /api/v1/orders            # Criar
GET    /api/v1/orders/{id}       # Buscar por ID
```

#### Dashboard

```http
GET    /api/v1/dashboard/stats   # Estatísticas gerais
```

### Exemplo de Requisição

#### Registrar Usuário

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

#### Criar Produto (com token)

```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "name": "Notebook Dell",
    "description": "i7, 16GB RAM, 512GB SSD",
    "price": 4500.00,
    "stock": 10
  }'
```

#### Criar Pedido

```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "productIds": [1, 2, 3],
    "couponCode": "BLACKFRIDAY"
  }'
```

---

## Testes

### Backend - Testes Unitários e de Integração

O backend possui **72 testes automatizados** cobrindo todas as camadas da aplicação:

```bash
cd backend

# Executar todos os testes
mvn test

# Ou com Maven wrapper (Windows)
.\mvnw.cmd test

# Ver relatório de cobertura
mvn jacoco:report
```

**Cobertura de testes:**

- ✅ Controllers (MockMvc)
- ✅ Services (JUnit + Mockito)
- ✅ Repositories (Spring Data JPA)
- ✅ Validações de negócio
- ✅ Tratamento de exceções

### Frontend - Testes de Componentes

O frontend possui **103 testes** cobrindo componentes, páginas e serviços:

```bash
cd frontend

# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Ver relatório de cobertura
npm run test:coverage
```

**Cobertura de testes:**

- ✅ 11 componentes testados
- ✅ 2 páginas testadas
- ✅ API service testado
- ✅ 103 testes passando (98.1%)
- ✅ Mocks configurados (Axios, React Router)

### Lint e Qualidade de Código

```bash
# Backend - Verificar código
cd backend
mvn checkstyle:check

# Frontend - Lint
cd frontend
npm run lint

# Build de produção (valida compilação)
npm run build
```

---

## CI/CD

O projeto inclui pipeline de CI/CD usando **GitHub Actions**.

### Workflow

```yaml
Push/PR → Testes Backend → Testes Frontend → Build Docker → Deploy
```

### Configuração

O arquivo `.github/workflows/ci-cd.yml` já está configurado para:

- ✅ Executar testes do backend
- ✅ Executar lint do frontend
- ✅ Build de ambos os projetos
- ✅ Construir imagens Docker (branch main)

### Deploy

Para deploy em produção, adicione os secrets no GitHub:

```
DOCKER_USERNAME
DOCKER_PASSWORD
SERVER_HOST
SERVER_USER
SERVER_SSH_KEY
```

---

## Variáveis de Ambiente

### Backend (application.properties)

```properties
# Database H2 (Development)
spring.datasource.url=jdbc:h2:mem:productsdb
spring.datasource.username=sa
spring.datasource.password=

# Database PostgreSQL (Production)
# spring.datasource.url=jdbc:postgresql://localhost:5432/pricewise
# spring.datasource.username=postgres
# spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server
server.port=8080

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### Frontend (env)

Por padrão, o frontend usa `http://localhost:8080` como base URL da API.

Para customizar, edite `src/services/api.js`:

```javascript
axios.defaults.baseURL = "http://localhost:8080";
```

---

## Regras de Negócio

### Produtos

- Nome deve ser único
- Preço deve ser maior que zero
- Estoque não pode ser negativo
- Soft delete preserva histórico

### Cupons

- Código deve ser único
- Tipo: `percent` (0-100) ou `fixed` (valor em R$)
- Validade obrigatória (de/até)
- OneShot: cupom pode ser usado apenas uma vez
- Cupom expirado não pode ser aplicado

### Pedidos

- Produtos devem ter estoque disponível
- Cupom deve estar válido
- Desconto não pode gerar valor negativo
- Valor final mínimo: R$ 0,01
- Estoque é decrementado automaticamente
- Cupons oneShot são marcados como usados

### Usuários

- Email único
- Senha mínima: 6 caracteres
- Roles: USER (padrão) ou ADMIN
- Apenas ADMIN pode criar/editar produtos e cupons

---

## Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

#### Backend

- Seguir convenções do Spring Boot
- Usar Lombok para reduzir boilerplate
- Documentar endpoints com Swagger
- Escrever testes para novas funcionalidades

#### Frontend

- Seguir guia de estilo do ESLint
- Usar componentes funcionais e Hooks
- Manter componentes pequenos e reutilizáveis
- Adicionar PropTypes quando necessário

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido como projeto de estudo Fullstack (Java + React)

---

**Versão**: 1.0.0

**Última Atualização**: Novembro 2025
