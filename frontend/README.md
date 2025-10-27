# Terminal CLI Template

A simple, clean terminal-based CLI template with a web interface. Perfect for building command-line applications with a retro terminal aesthetic.

## Features

- 🖥️ Retro terminal interface
- ⌨️ Command-line interface
- 🎨 Customizable styling
- 📱 Responsive design
- 🚀 Built with Express.js

## Getting Started

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Built-in Commands

- `/help` - Show available commands
- `/clear` - Clear the terminal screen
- `/time` - Display current time
- `/echo <text>` - Echo back the text

## Keyboard Shortcuts

- `Ctrl+L` - Clear display
- `Ctrl+C` - Clear input
- `Page Up/Down` - Scroll through output
- `Ctrl+End` - Scroll to bottom
- `Ctrl+Home` - Scroll to top

## Customization

### Adding New Commands

Edit `server.js` and add your command handlers in the `/api/command` endpoint:

```javascript
else if (command === '/mycommand') {
  res.json({ 
    type: 'response', 
    message: 'Your response here' 
  });
}
```

### Styling

Customize the terminal appearance by editing `public/style.css`:

- Change colors in the CSS variables
- Modify fonts and sizes
- Adjust terminal dimensions

## Project Structure

```
├── server.js          # Express server and command handlers
├── package.json       # Dependencies and scripts
├── public/
│   ├── index.html     # Terminal UI
│   ├── script.js      # Client-side logic
│   └── style.css      # Terminal styling
└── README.md          # This file
```

## License

MIT
