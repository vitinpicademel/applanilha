// Script personalizado para iniciar o servidor standalone
const { exec } = require('child_process');
const path = require('path');
const http = require('http');

// Porta padrão ou a definida pelo ambiente
const PORT = process.env.PORT || 3000;

// Caminho para o servidor standalone
const serverPath = path.join(__dirname, '.next/standalone/server.js');

console.log('\x1b[36m%s\x1b[0m', '🚀 Iniciando o servidor AppDonna...');
console.log('\x1b[36m%s\x1b[0m', `📂 Caminho do servidor: ${serverPath}`);

// Verifica se a porta está disponível
const checkPort = () => {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log('\x1b[33m%s\x1b[0m', `⚠️ Porta ${PORT} já está em uso!`);
        reject(err);
      } else {
        reject(err);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve();
    });
    
    server.listen(PORT);
  });
};

// Inicia o servidor
const startServer = () => {
  // Use spawn para manter o stdout/stderr
  const child = exec(`node ${serverPath}`);
  
  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  child.stderr.on('data', (data) => {
    console.error('\x1b[31m%s\x1b[0m', data.toString());
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Servidor encerrado com código ${code}`);
    }
  });
  
  // Mostra instruções claras para o usuário
  console.log('\x1b[32m%s\x1b[0m', `✅ Servidor iniciado com sucesso!`);
  console.log('\x1b[32m%s\x1b[0m', `🌐 Acesse a aplicação em: http://localhost:${PORT}`);
  console.log('\x1b[32m%s\x1b[0m', `🛑 Pressione Ctrl+C para encerrar o servidor`);
};

// Executa o processo
checkPort()
  .then(startServer)
  .catch((err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('\x1b[33m%s\x1b[0m', `⚠️ Tente outra porta definindo a variável de ambiente PORT.`);
      console.log('\x1b[33m%s\x1b[0m', `Exemplo: PORT=4000 node server.js`);
    } else {
      console.error('\x1b[31m%s\x1b[0m', `❌ Erro ao iniciar o servidor: ${err.message}`);
    }
  }); 