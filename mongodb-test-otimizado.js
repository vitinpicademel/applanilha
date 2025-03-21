// Script otimizado para testar a conexão com o MongoDB
// Execução: node mongodb-test-otimizado.js
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.cyan}=== TESTE DE CONEXÃO AVANÇADO COM MONGODB ===${colors.reset}\n`);

// Buscar string de conexão
function getConnectionString() {
  return new Promise((resolve) => {
    // Tentar ler do arquivo .env primeiro
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envLines = envContent.split('\n');
        
        for (const line of envLines) {
          if (line.startsWith('DATABASE_URL=')) {
            const mongoUrl = line.substring(13).replace(/^"(.*)"$/, '$1').trim();
            console.log(`${colors.green}✔${colors.reset} String de conexão encontrada no arquivo .env`);
            return resolve(mongoUrl);
          }
        }
      }
    } catch (err) {
      console.log(`${colors.yellow}⚠${colors.reset} Não foi possível ler o arquivo .env: ${err.message}`);
    }
    
    // Se não encontrou no .env, perguntar ao usuário
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(`${colors.yellow}?${colors.reset} Digite a string de conexão do MongoDB: `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Função principal de teste
async function testMongoDB(connectionString) {
  console.log(`${colors.blue}ℹ${colors.reset} Iniciando teste com MongoDB...`);
  
  // Extrair a URL base e banco de dados
  const parsedUrl = new URL(connectionString);
  const dbName = parsedUrl.pathname.substring(1) || 'test';
  
  // Mostrar informações da conexão (ocultando senha)
  const hostInfo = `${parsedUrl.protocol}//${parsedUrl.username}:***@${parsedUrl.host}`;
  console.log(`${colors.blue}ℹ${colors.reset} Host: ${hostInfo}`);
  console.log(`${colors.blue}ℹ${colors.reset} Banco de dados: ${dbName}`);
  
  let client;
  try {
    // Conectar ao MongoDB
    console.log(`\n${colors.cyan}[1/5]${colors.reset} Conectando ao servidor MongoDB...`);
    client = new MongoClient(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    console.log(`${colors.green}✔${colors.reset} Conectado com sucesso ao servidor MongoDB!`);
    
    // Testar acesso ao banco de dados
    console.log(`\n${colors.cyan}[2/5]${colors.reset} Testando acesso ao banco de dados '${dbName}'...`);
    const db = client.db(dbName);
    
    // Listar coleções
    console.log(`${colors.cyan}[3/5]${colors.reset} Listando coleções disponíveis...`);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log(`${colors.yellow}⚠${colors.reset} Nenhuma coleção encontrada`);
    } else {
      console.log(`${colors.green}✔${colors.reset} ${collections.length} coleções encontradas:`);
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }
    
    // Executar operações CRUD na coleção de teste
    console.log(`\n${colors.cyan}[4/5]${colors.reset} Executando operações CRUD em uma coleção de teste...`);
    const testCollection = db.collection('connection_test');
    
    // Criar um documento
    const testDoc = {
      name: 'Teste de Conexão',
      timestamp: new Date(),
      value: Math.floor(Math.random() * 1000)
    };
    
    console.log(`${colors.blue}ℹ${colors.reset} Inserindo documento...`);
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`${colors.green}✔${colors.reset} Documento inserido. ID: ${insertResult.insertedId}`);
    
    // Ler o documento
    console.log(`${colors.blue}ℹ${colors.reset} Buscando documento...`);
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log(`${colors.green}✔${colors.reset} Documento encontrado: ${JSON.stringify(foundDoc.name)}`);
    
    // Atualizar o documento
    console.log(`${colors.blue}ℹ${colors.reset} Atualizando documento...`);
    const updateResult = await testCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { updated: true, updatedAt: new Date() } }
    );
    console.log(`${colors.green}✔${colors.reset} Documento atualizado. Alterações: ${updateResult.modifiedCount}`);
    
    // Excluir o documento
    console.log(`${colors.blue}ℹ${colors.reset} Excluindo documento...`);
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log(`${colors.green}✔${colors.reset} Documento excluído. Total: ${deleteResult.deletedCount}`);
    
    // Verificar a configuração do Prisma
    console.log(`\n${colors.cyan}[5/5]${colors.reset} Verificando configuração do Prisma...`);
    
    try {
      const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
      if (fs.existsSync(schemaPath)) {
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        
        if (schemaContent.includes('provider = "mongodb"')) {
          console.log(`${colors.green}✔${colors.reset} Prisma configurado para MongoDB`);
          
          // Verificar se o banco de dados no schema corresponde à URL
          if (schemaContent.includes('env("DATABASE_URL")')) {
            console.log(`${colors.green}✔${colors.reset} Prisma configurado para usar variável de ambiente DATABASE_URL`);
          } else {
            console.log(`${colors.yellow}⚠${colors.reset} Prisma não está configurado para usar DATABASE_URL. Verifique o schema.`);
          }
        } else {
          console.log(`${colors.yellow}⚠${colors.reset} Prisma não está configurado para MongoDB. Verifique o provider no schema.`);
        }
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} Schema do Prisma não encontrado em prisma/schema.prisma`);
      }
    } catch (err) {
      console.log(`${colors.yellow}⚠${colors.reset} Erro ao verificar o schema do Prisma: ${err.message}`);
    }
    
    // Exibir resumo
    console.log(`\n${colors.bright}${colors.green}✓ TESTE CONCLUÍDO COM SUCESSO!${colors.reset}`);
    console.log(`\n${colors.bright}Resumo:${colors.reset}`);
    console.log(`- Conexão com o servidor: ${colors.green}OK${colors.reset}`);
    console.log(`- Acesso ao banco de dados: ${colors.green}OK${colors.reset}`);
    console.log(`- Operação de escrita: ${colors.green}OK${colors.reset}`);
    console.log(`- Operação de leitura: ${colors.green}OK${colors.reset}`);
    console.log(`- Operação de atualização: ${colors.green}OK${colors.reset}`);
    console.log(`- Operação de exclusão: ${colors.green}OK${colors.reset}`);
    
    console.log(`\n${colors.bright}${colors.blue}Recomendações:${colors.reset}`);
    console.log(`1. Se estiver enfrentando problemas com o Prisma, execute: ${colors.cyan}npx prisma generate${colors.reset}`);
    console.log(`2. Verifique se a string de conexão em .env está correta e tem os parâmetros necessários`);
    console.log(`3. Para problemas com IDs, certifique-se de usar ${colors.cyan}@db.ObjectId${colors.reset} nos campos ID do Schema Prisma`);
    
    return true;
  } catch (error) {
    console.log(`\n${colors.bright}${colors.red}✗ ERRO DURANTE O TESTE${colors.reset}`);
    console.log(`${colors.red}Detalhes do erro: ${error.message}${colors.reset}`);
    
    // Fornecer sugestões com base no erro
    console.log(`\n${colors.bright}${colors.yellow}Possíveis soluções:${colors.reset}`);
    
    if (error.message.includes('connection')) {
      console.log(`1. Verifique se a string de conexão está correta`);
      console.log(`2. Certifique-se de que seu IP está na lista de permissões do MongoDB Atlas`);
      console.log(`3. Verifique se o MongoDB está em execução (se for local)`);
    } else if (error.message.includes('authentication')) {
      console.log(`1. Verifique se o nome de usuário e senha estão corretos`);
      console.log(`2. Confirme se o usuário tem permissões no banco de dados especificado`);
    } else if (error.message.includes('timeout')) {
      console.log(`1. Verifique sua conexão de rede`);
      console.log(`2. O servidor MongoDB pode estar sobrecarregado ou inacessível`);
    }
    
    console.log(`\n${colors.yellow}String de conexão recomendada para MongoDB Atlas:${colors.reset}`);
    console.log(`${colors.cyan}mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true${colors.reset}`);
    
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log(`\n${colors.blue}ℹ${colors.reset} Conexão com MongoDB fechada`);
    }
  }
}

// Executar o teste
(async () => {
  const mongoUrl = await getConnectionString();
  if (!mongoUrl) {
    console.log(`${colors.red}✗${colors.reset} String de conexão não fornecida. Teste cancelado.`);
    process.exit(1);
  }
  
  try {
    // Validação básica da URL
    new URL(mongoUrl);
  } catch (err) {
    console.log(`${colors.red}✗${colors.reset} String de conexão inválida: ${err.message}`);
    process.exit(1);
  }
  
  console.log(`${colors.bright}${colors.blue}Iniciando teste com string de conexão fornecida...${colors.reset}\n`);
  const success = await testMongoDB(mongoUrl);
  
  // Finalizar
  process.exit(success ? 0 : 1);
})(); 