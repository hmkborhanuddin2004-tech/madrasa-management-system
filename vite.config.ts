import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'security-guards',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0] || '';
          if (
            url.startsWith('/.git') || 
            url.startsWith('/.env') || 
            url.startsWith('/admin') ||
            url === '/api/debug' || 
            url === '/swagger.json' || 
            url === '/openapi.json' || 
            url === '/metrics' || 
            url === '/graphql' || 
            url === '/config.json'
          ) {
            res.statusCode = 403;
            res.end('403 Forbidden');
            return;
          }
          res.setHeader('X-Frame-Options', 'SAMEORIGIN');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    host: true,
    fs: {
      deny: ['.env', '.env.*', '.git', '**/.git/**']
    },
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
})
