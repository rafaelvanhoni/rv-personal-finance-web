# 💻 RV Personal Finance Web

> 📌 **Status:** V1 do frontend Angular implementada e validada localmente.

Frontend web do **RV Personal Finance**, criado para operar de forma simples as funcionalidades disponíveis na API.

## Relação com o backend

Este repositório contém somente o frontend. O domínio, as regras de negócio e os contratos HTTP pertencem ao backend [.NET RV Personal Finance](https://github.com/rafaelvanhoni/rv-personal-finance), que é a fonte de verdade do sistema.

## Stack

- Angular 22 e TypeScript
- Angular Material
- Reactive Forms e HttpClient
- HTML e SCSS

## Telas previstas

- Login e cadastro de usuário
- Dashboard financeiro
- Contas e saldos
- Categorias
- Transações

## Execução local

Pré-requisitos: Node.js `22.22.3+`, `24.15.0+` ou `26+`, npm e a API disponível em `http://localhost:5099`.

```bash
npm install
npm start
```

No desenvolvimento, requisições para `/api` são encaminhadas à API local pelo proxy do Angular.

```bash
npm test -- --watch=false
npm run build
```

## Arquitetura

As decisões técnicas, integrações e limitações atuais estão em [docs/architecture.md](docs/architecture.md).

O acompanhamento visual do projeto está em [docs/kanban-do-projeto.html](docs/kanban-do-projeto.html).
