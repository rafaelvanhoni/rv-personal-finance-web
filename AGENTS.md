# Diretrizes permanentes

## Escopo e fonte de verdade

- `rv-personal-finance-web` é o único repositório que pode ser alterado.
- `rv-personal-finance` é o backend de referência e deve ser tratado como somente leitura, salvo autorização explícita.
- O backend é a fonte de verdade para domínio, regras de negócio e contratos HTTP.
- Não crie funcionalidades que não existam no backend sem autorização.

## Desenvolvimento

- Use Angular 22 e siga a arquitetura definida em `docs/architecture.md`.
- Mantenha código simples, legível e proporcional ao tamanho do projeto.
- Evite overengineering e dependências desnecessárias.
- Escreva código, identificadores, nomes de arquivos e pastas, e commits estritamente em inglês.
- Escreva documentação e textos visíveis ao usuário em português (pt-BR).
- Antes de implementar mudanças relevantes, consulte `README.md` e `docs/architecture.md`.

## Segurança e Git

- Nunca versione credenciais, senhas, tokens, JWTs, API keys, secrets, chaves privadas, certificados privados, dumps de banco ou dados pessoais e financeiros reais.
- Use somente dados fictícios em exemplos, testes, documentação, fixtures e screenshots destinadas ao repositório.
- Mantenha arquivos `.env`, configurações locais sensíveis e arquivos com secrets fora do Git.
- Nunca coloque segredos no código Angular, em arquivos de environment ou em conteúdo entregue ao navegador; considere todo o bundle frontend público.
- Forneça configurações sensíveis de produção externamente pelo ambiente de deploy.
- Não documente dados reais e desnecessários da infraestrutura doméstica, como IPs, hostnames, dispositivos, usuários SSH, portas expostas, endereços Tailscale, domínios internos, certificados ou regras de firewall.
- Na documentação pública, use descrições genéricas como servidor Linux, servidor de produção ou placeholders.
- Antes de commit ou push, revise os arquivos staged e interrompa o processo diante de qualquer possível exposição sensível.
- Não adicione um arquivo ao Git apenas por estar em uso local; primeiro avalie se seu conteúdo é apropriado para um repositório público.

## Documentação

- Mantenha a documentação mínima, objetiva e fácil de manter.
- Não crie novos documentos automaticamente.
- Concentre arquitetura e domínio em `docs/architecture.md`, usando C4 e DDD apenas no nível necessário para compreender o sistema.
- Prefira diagramas Mermaid quando forem mais claros que texto.
- Atualize README, arquitetura ou Kanban somente quando uma mudança real tornar o conteúdo desatualizado.

## Fontes de contexto

- `README.md` — visão geral.
- `docs/architecture.md` — arquitetura, domínio, integração e decisões técnicas.
- `docs/kanban-do-projeto.html` — acompanhamento visual; não é fonte de requisitos.
- `rv-personal-finance` — implementação real do backend e fonte de verdade dos contratos.
