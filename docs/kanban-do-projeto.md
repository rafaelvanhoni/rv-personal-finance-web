# Kanban do projeto

> Atualizado em 24/08/2026. Visão de acompanhamento; não é fonte oficial de requisitos.

Do entendimento da API existente até um frontend Angular funcional. O quadro separa o escopo imediato do frontend das evoluções futuras que pertencem ao backend.

## Concluído — 9

- [x] **Descoberta — Backend completamente inspecionado** — Domínio, ownership, autenticação, endpoints, DTOs, validações, persistência e testes mapeados.
- [x] **Arquitetura — Estrutura do frontend aprovada** — Angular standalone, organização por feature, seis telas e integração JWT definidos.
- [x] **Documentação — Documentação inicial criada** — README, arquitetura técnica e quadro do projeto sintetizam o estado atual.
- [x] **Fundação — Workspace Angular 22 inicializado** — Base standalone, Material, SCSS, rotas lazy e proxy local configurados.
- [x] **Autenticação — Login, cadastro e sessão JWT** — Rotas públicas, guard, interceptor, tratamento de 401 e logout local concluídos.
- [x] **Dashboard — Visão geral financeira** — Saldo atual, receitas, despesas e gastos acumulados por categoria implementados.
- [x] **Cadastros — Contas e categorias** — CRUDs, diálogos, confirmações, conflitos e consulta de saldo concluídos.
- [x] **Movimentações — Transações** — CRUD completo com conta, categoria, tipo, valor e data concluído.
- [x] **Qualidade — Testes e refinamento concluídos** — Fluxos críticos testados, build válido e interface revisada em desktop e celular.

## Agora — 0

Nenhum item em andamento.

## Próximo — 1

- [ ] **Operação — Deploy no servidor Linux** — Publicar frontend e backend no servidor para o primeiro uso real.

## Backlog — 7

Os itens abaixo são evoluções futuras do backend e não pertencem ao escopo imediato do frontend.

- [ ] **Backend futuro — Validar cadastro e credenciais** — Adicionar validação própria para nome, e-mail e senha sem depender do frontend.
- [ ] **Backend futuro — Normalizar e garantir e-mail único** — Tratar diferenças de caixa e criar restrição de unicidade no banco.
- [ ] **Backend futuro — Evoluir a sessão autenticada** — Avaliar refresh token, perfil do usuário e encerramento de sessão no servidor.
- [ ] **Backend futuro — Paginar, filtrar e ordenar consultas** — Evitar que listas crescentes sejam sempre carregadas por completo.
- [ ] **Backend futuro — Consultar histórico por período** — Permitir filtros de data em transações e indicadores do dashboard.
- [ ] **Backend futuro — Explicitar moeda no domínio** — Substituir a suposição visual de BRL por um contrato financeiro explícito.
- [ ] **Backend futuro — Padronizar exposição da API** — Avaliar CORS, prefixo, versionamento e DTOs com nomes das relações.
