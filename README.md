# 💻 RV Personal Finance Web

> 📌 **Status:** V1 do frontend Angular implementada e validada localmente.

Esta aplicação dá continuidade ao **RV Personal Finance**, um sistema real de finanças pessoais para uso doméstico que também funciona como laboratório de engenharia e aprendizado.

Seu objetivo é levar ao navegador, em uma experiência simples e em português, as funcionalidades de autenticação, acompanhamento de saldos e gestão financeira oferecidas pela API.

## Relação com o backend

Este repositório contém somente o frontend. O domínio, as regras de negócio e os contratos HTTP pertencem ao backend [.NET RV Personal Finance](https://github.com/rafaelvanhoni/rv-personal-finance), que é a fonte de verdade do sistema.

O frontend é responsável pela experiência de uso, enquanto domínio, validações e contratos permanecem no backend, evitando duplicar regras de negócio no navegador.

## Stack

- Angular 22 e TypeScript
- Angular Material
- Reactive Forms e HttpClient
- HTML e SCSS

## Funcionalidades da V1

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
