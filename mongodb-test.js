// Script para testar a conexão com o MongoDB
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Ler o arquivo .env manualmente
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

// Extrair a URL do MongoDB
let mongoUrl = null;
for (const line of envLines) {
  if (line.startsWith('DATABASE_URL=')) {
    mongoUrl = line.substring(14).replace(/^"(.*)"$/, '$1');
    break;
  }
}

console.log('=== TESTE DE CONEXÃO COM MONGODB ===');

if (!mongoUrl) {
  console.error('❌ DATABASE_URL não encontrada no arquivo .env');
  process.exit(1);
}

// Limpar a URL do MongoDB para evitar problemas com os parâmetros
const baseUrl = mongoUrl.split('?')[0];
const cleanUrl = baseUrl + '?retryWrites=true';

console.log(`🔍 URL do MongoDB encontrada: ${baseUrl.substring(0, 20)}...`);
console.log(`🔧 Usando URL simplificada para teste`);

async function testMongoDBConnection() {
  const client = new MongoClient(cleanUrl, {
    // Adicionar opções explícitas para evitar problemas com os parâmetros
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  try {
    console.log('📡 Tentando conectar ao servidor MongoDB...');
    await client.connect();
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
    
    // Extrair o nome do banco de dados da URL de conexão
    const dbName = baseUrl.split('/').pop() || 'test';
    console.log(`📦 Banco de dados: ${dbName}`);
    
    // Obter o banco de dados
    const db = client.db(dbName);
    
    // Listar as coleções disponíveis
    const collections = await db.listCollections().toArray();
    console.log('📋 Coleções disponíveis:');
    if (collections.length === 0) {
      console.log('   Nenhuma coleção encontrada');
    } else {
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }
    
    // Testar a criação de um documento temporário
    const collection = db.collection('test_connection');
    const testDocument = {
      name: 'Test Connection',
      timestamp: new Date(),
      test: true
    };
    
    // Inserir o documento
    console.log('🔄 Inserindo documento de teste...');
    const insertResult = await collection.insertOne(testDocument);
    console.log(`✅ Documento de teste inserido com sucesso. ID: ${insertResult.insertedId}`);
    
    // Recuperar o documento
    const foundDocument = await collection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Documento recuperado com sucesso:');
    console.log(foundDocument);
    
    // Excluir o documento
    await collection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Documento de teste excluído com sucesso');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 Conexão com MongoDB fechada');
    }
  }
}

// Executar o teste
console.log('⏳ Iniciando teste de conexão...');
testMongoDBConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Teste de MongoDB concluído com sucesso! A conexão está funcionando.');
      console.log('\n🔧 Recomendações:');
      console.log('1. Verifique se suas operações de escrita estão funcionando corretamente');
      console.log('2. Certifique-se de que o Prisma está configurado corretamente');
      console.log('3. A URL simplificada para o MongoDB é:', cleanUrl);
    } else {
      console.log('\n❌ Teste de MongoDB falhou. Verifique os erros acima.');
    }
    // Forçar a saída após o teste
    setTimeout(() => process.exit(0), 500);
  })
  .catch(error => {
    console.error('\n❌ Erro inesperado durante o teste:', error);
    process.exit(1);
  }); 