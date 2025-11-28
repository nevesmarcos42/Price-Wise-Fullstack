# 🧾Price-Wise-Fullstack

Sistema de gerenciamento de produtos com controle de estoque, aplicação de descontos e cupons promocionais. Oferece API RESTful com regras de negócio rigorosas, validações, soft delete e listagem com filtros avançados. Interface moderna e funcional com React.

Back-end da aplicação **Price Wise**, responsável por gerenciar produtos, pedidos e cupons com regras de negócio avançadas.

---

## 🚀 Tecnologias

- Java 17 + Spring Boot 3
- Spring Data JPA (com Hibernate)
- H2 Database (testes) / PostgreSQL (produção)
- Spring Web (REST APIs)
- JUnit 5 + AssertJ (testes)
- Maven + MapStruct

---

## ✅ Funcionalidades da API

- 📦 Criar pedidos com múltiplos produtos
- 💸 Aplicar cupons de desconto do tipo:
  - `percent`: percentual (%)
  - `fixed`: valor fixo (R$)
- ⛔ Regras validadas:
  - Cupom expirado → `400 Bad Request`
  - Cupom inexistente → `404 Not Found`
  - Produto inválido → `404 Not Found`
  - Cupom de uso único (`oneShot`) já utilizado → `409 Conflict`
  - Preço final abaixo de R$ 0,01 → `422 Unprocessable Entity`

---

## 📂 Estrutura de pacotes

| Pacote       | Responsabilidade                               |
| ------------ | ---------------------------------------------- |
| `controller` | Endpoints REST                                 |
| `dto`        | Entrada e saída de dados                       |
| `mapper`     | Conversão entre DTOs e entidades               |
| `model`      | Entidades JPA (Product, Coupon, Order...)      |
| `repository` | Interfaces de persistência com Spring Data JPA |
| `service`    | Lógica de negócios                             |

---

## 🧪 Testes automatizados

- Testes de unidade e integração com cobertura de:
  - Cupom válido
  - Cupom expirado/inexistente
  - Produto inválido
  - Cupom `oneShot` reaplicado
  - Pedido com valor inválido

Execute com:

```bash
./mvnw test



🧼 Como rodar o projeto localmente
# Compile
./mvnw clean install

# Rode o servidor
./mvnw spring-boot:run


A API será exposta em: http://localhost:8080

🧾 Front-end (em breve)
A interface web será desenvolvida com ReactJS em uma pasta separada (/frontend), consumindo essa API.
📌 Em breve o README será atualizado com instruções específicas do front-end.

🗂️ To do (Próximos passos)
- [ ] Adicionar Swagger/OpenAPI para documentação interativa
- [ ] Implementar lógica de cupom do tipo fixed
- [ ] Implementar camada de autenticação (JWT)
- [ ] Criar front-end com ReactJS
- [ ] Deploy em ambiente cloud

👨‍💻 Autor
Projeto desenvolvido por mim como parte de estudo Fullstack Java + React
```
