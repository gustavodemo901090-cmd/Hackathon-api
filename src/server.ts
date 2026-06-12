import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3000;

app
  .listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
  })
  .on('error', (error) => {
    console.error(`✗ Error starting server: ${error.message}`);
    process.exit(1);
  });
