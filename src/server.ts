import 'dotenv/config';
import app from './app';
import { AppDataSource } from './config/data-source';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('✓ Banco de dados conectado');
    app
      .listen(PORT, () => {
        console.log(`✓ Server is running on http://localhost:${PORT}`);
      })
      .on('error', (error) => {
        console.error(`✗ Error starting server: ${error.message}`);
        process.exit(1);
      });
  })
  .catch((err: Error) => {
    console.error('✗ Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  });
