# API de Gerenciamento de Usuários com MongoDB

Sistema completo de gerenciamento de usuários desenvolvido com Next.js e MongoDB, com recursos avançados de diagnóstico e monitoramento.

## Funcionalidades

- Registro e autenticação de usuários
- Gerenciamento de equipes
- Controle de permissões (MASTER, GESTOR, CORRETOR)
- Sistema de logs operacionais
- Ferramentas de diagnóstico de banco de dados
- Dashboard de status do sistema

## Tecnologias Utilizadas

- **Next.js 14**: Framework React para desenvolvimento de aplicações web
- **MongoDB**: Banco de dados NoSQL
- **Prisma**: ORM para acesso ao banco de dados
- **bcrypt**: Biblioteca para hash de senhas
- **TailwindCSS**: Framework CSS para design responsivo

## Requisitos

- Node.js 18+ 
- NPM ou Yarn
- MongoDB (Atlas ou local)

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure o arquivo `.env` com as informações do MongoDB:
   ```
   DATABASE_URL="mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/seu_banco?retryWrites=true"
   ```
4. Execute as migrações do Prisma:
   ```
   npx prisma generate
   ```
5. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
6. Acesse a aplicação em `http://localhost:3000`

## Ferramentas de Diagnóstico

O sistema inclui várias ferramentas para diagnóstico e monitoramento:

### Página de Diagnóstico de Banco de Dados

Acesse `/diagnose` para verificar a conectividade com o MongoDB. Esta página executa:
- Teste de conexão
- Teste de operações de escrita
- Teste de operações de leitura
- Teste de operações de exclusão
- Contagem de usuários

### Página de Logs do Sistema

Acesse `/logs` para visualizar os logs operacionais do sistema. Você pode filtrar por:
- Tipo de ação (LOGIN, CREATE, UPDATE, DELETE, etc.)
- Entidade (USER, SYSTEM, DATABASE, etc.)
- Status (sucesso ou erro)

### Dashboard de Status do Sistema

Acesse `/admin/status` para uma visão geral do status do sistema, incluindo:
- Status do banco de dados
- Contagem de usuários
- Contagem de logs
- Ações administrativas

### Scripts de Terminal

O projeto inclui dois scripts para teste direto no terminal:

1. **Teste Básico**: Verifica a conexão com o MongoDB
   ```
   node mongodb-test.js
   ```

2. **Teste Avançado**: Executa um diagnóstico completo do MongoDB e do Prisma
   ```
   node mongodb-test-otimizado.js
   ```

## Estrutura do Projeto

- `src/app/api/`: Endpoints da API
- `src/lib/prisma.ts`: Configuração do Prisma e funções auxiliares
- `src/lib/logger.ts`: Sistema de logs operacionais
- `prisma/schema.prisma`: Definição do schema do banco de dados
- `src/app/admin/`: Páginas administrativas
- `src/app/diagnose/`: Ferramentas de diagnóstico

## Modelos de Dados

### User

Modelo principal para autenticação e gerenciamento de acessos:
- `id`: Identificador único (ObjectId)
- `name`: Nome completo do usuário
- `email`: Email único para login
- `password`: Senha armazenada com hash
- `role`: Nível de acesso (MASTER, GESTOR, CORRETOR)
- `teamId`: Referência à equipe (opcional)
- `managerId`: ID do gestor responsável (para CORRETORs)
- `active`: Status do usuário (ativo/inativo)
- `lastLogin`: Timestamp do último acesso
- `createdAt`/`updatedAt`: Timestamps de criação e atualização

### SystemLog

Registro de operações do sistema:
- `id`: Identificador único (ObjectId)
- `userId`: Referência ao usuário que realizou a ação (opcional)
- `action`: Tipo de ação (LOGIN, CREATE, UPDATE, DELETE, etc.)
- `entity`: Entidade afetada (USER, SYSTEM, DATABASE, etc.)
- `details`: Detalhes da operação em formato JSON
- `success`: Indicador de sucesso/falha
- `ip`: Endereço IP de origem (opcional)
- `userAgent`: Navegador/dispositivo (opcional)
- `createdAt`: Timestamp da operação

## Soluções para Problemas Comuns

### Problema: Falha ao salvar dados no MongoDB

**Sintomas**: As APIs retornam sucesso, mas os dados não são salvos no banco de dados.

**Solução**:

1. Verifique a URL de conexão do MongoDB no arquivo `.env`.
2. Use a página de diagnóstico em `/diagnose` para testar a conexão.
3. Execute o script de teste avançado: `node mongodb-test-otimizado.js`.
4. Verifique os logs do sistema em `/logs` para identificar erros específicos.
5. Certifique-se de que está usando `@db.ObjectId` no schema do Prisma para os campos ID.

## Endpoints da API

- `POST /api/register`: Registro de novos usuários
- `POST /api/login`: Autenticação de usuários
- `POST /api/logout`: Registro de logout de usuários
- `GET|POST /api/users`: Busca de usuários (suporta filtros)
- `POST /api/users/delete`: Exclusão de usuário
- `POST /api/users/update`: Atualização de usuário
- `GET /api/testerdb`: Teste de conexão com o MongoDB
- `GET /api/logs`: Consulta de logs do sistema (suporta filtros)
- `GET /api/init`: Inicialização do sistema

## Desenvolvimento

Para ambiente de desenvolvimento, execute:

```
npm run dev
```

Para construir a versão de produção:

```
npm run build
```

Para iniciar a versão de produção:

```
npm run start:prod
```

## Suporte

Para suporte e informações adicionais, consulte a documentação completa na pasta `docs/` ou envie um email para support@example.com. 