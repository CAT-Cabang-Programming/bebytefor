const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Command handler
app.post('/api/command', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    // Handle built-in commands
    if (command === '/help') {
      res.json({ 
        type: 'response', 
        message: 'Available commands:\n  /help - Show this help message\n  /clear - Clear the terminal\n  /time - Show current time\n  /echo <text> - Echo back text' 
      });
    } else if (command === '/clear') {
      res.json({ type: 'clear' });
    } else if (command === '/time') {
      res.json({ 
        type: 'response', 
        message: new Date().toLocaleString() 
      });
    } else if (command.startsWith('/echo ')) {
      res.json({ 
        type: 'response', 
        message: command.substring(6) 
      });
    } else {
      res.json({ 
        type: 'response', 
        message: `Unknown command: ${command}\nType /help for available commands` 
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