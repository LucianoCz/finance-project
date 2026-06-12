# Personal Finance API

## Descrição

Esta é uma API RESTful para controle de finanças pessoais. Com ela, os usuários podem se cadastrar, fazer login (com autenticação JWT) e registrar suas movimentações financeiras (receitas e despesas).

## Tecnologias Utilizadas

- **Linguagem:** TypeScript + Node.js
- **Framework Web:** Express
- **Banco de Dados:** MongoDB (Mongoose)
- **Autenticação:** JWT (JSON Web Tokens)
- **Containerização:** Docker e Docker Compose
- **Testes:** Jest

## Instruções de Execução

Para rodar este projeto, certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.

1. Clone o repositório ou acesse a pasta do projeto.
2. Na raiz do projeto, execute o comando:
   ```bash
   docker-compose up --build
   ```
3. A aplicação estará disponível na porta `3000`. O banco de dados MongoDB rodará na porta `27017`.
4. Uma `collection.json` está disponível na raiz do projeto para importar e testar os endpoints no Postman ou Insomnia.

### Como rodar os testes
Os testes automatizados foram construídos utilizando Jest. Para executá-los localmente:
1. Instale as dependências: `npm install`
2. Rode os testes: `npm run test`
