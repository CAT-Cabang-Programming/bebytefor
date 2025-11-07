
require('dotenv').config();
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const API_BASE_URL = process.env.VITE_API_BASE_URL;
console.log('Backend URL:', API_BASE_URL);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  '/api/threads',
  createProxyMiddleware({
    target: API_BASE_URL,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/api\/threads/, '/threads'),
  })
);

app.use(
  '/api/users',
  createProxyMiddleware({
    target: API_BASE_URL,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/api\/users/, '/users'),
  })
);

app.use(
  '/api/comments',
  createProxyMiddleware({
    target: API_BASE_URL,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/api\/comments/, '/comments'),
  })
);
app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: 'Command is required' });

  try {
    if (command === '/help') {
      return res.json({
        type: 'response',
        message:
          'Available commands:\n  /help - Show this help message\n  /clear - Clear the terminal\n  /time - Show current time\n  /echo <text> - Echo back text',
      });
    } else if (command === '/clear') {
      return res.json({ type: 'clear' });
    } else if (command === '/time') {
      return res.json({
        type: 'response',
        message: new Date().toLocaleString(),
      });
    } else if (command.startsWith('/echo ')) {
      return res.json({
        type: 'response',
        message: command.substring(6),
      });
    } else if (command === '/start') {
      return res.json({
        type: 'response',
        message:
          `welcome to bytefor, where we connect tru only text (anonymously, anybody cant see your data, neither of us.)\n` +
          `your data are entirely encrypted.\n\n\nto start:\n/help: to display instruction on how to use command.\n/login: to log in to your account.`,
      });
    } else if (command.startsWith('/check ')) { 
        const userId = command.split(' ')[1];
        const response = await fetch(`${API_BASE_URL}/users/search/${userId}`);
        const data = await response.json();
        return res.json({
          type: 'response',
          message: `(200) found the user informations \n\nusername : ${data.data.username}`
        });
      } else {
      return res.json({
        type: 'response',
        message: `Unknown command: ${command}\nType /help for available commands`,
      });
    }
  } catch (error) {
    console.error('[API] Error processing command:', error);
    res.status(500).json({ error: 'Error processing command' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Server] Terminal CLI running on http://localhost:${PORT}`);
  });
}

module.exports = app;

