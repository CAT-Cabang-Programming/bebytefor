const output = document.getElementById('output');
const input = document.getElementById('input');
const cursor = document.querySelector('.cursor');
const scrollIndicator = document.getElementById('scrollIndicator');

let isProcessing = false;
let isUserScrolling = false;
let scrollTimeout = null;

input.focus();

output.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = output;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    
    if (!isAtBottom) {
        isUserScrolling = true;
        scrollIndicator.classList.add('show');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 2000);
    } else {
        isUserScrolling = false;
        scrollIndicator.classList.remove('show');
    }
});

scrollIndicator.addEventListener('click', () => {
    isUserScrolling = false;
    smoothScrollToBottom();
    scrollIndicator.classList.remove('show');
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isProcessing) {
        const command = input.value.trim();
        if (command) {
            handleCommand(command);
            input.value = '';
        }
    }
});

document.addEventListener('click', () => {
    input.focus();
});

function handleCommand(command) {
    if (command === '/clear') {
        clearOutput();
        return;
    }
    
    addMessage(command, 'user-message');
    sendCommand(command);
}

function sendCommand(command) {
    if (isProcessing) return;
    
    isProcessing = true;
    cursor.style.display = 'none';
    
    fetch('/api/command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command })
    })
    .then(response => response.json())
    .then(data => {
        if (data.type === 'clear') {
            clearOutput();
        } else if (data.type === 'response') {
            addMessage(data.message, 'response-message');
        } else if (data.error) {
            addMessage(data.error, 'error');
        }
        
        isProcessing = false;
        cursor.style.display = 'inline';
        input.focus();
        smoothScrollToBottom();
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('Error processing command', 'error');
        isProcessing = false;
        cursor.style.display = 'inline';
        input.focus();
    });
}

function clearOutput() {
    isUserScrolling = false;
    scrollIndicator.classList.remove('show');
    output.innerHTML = `
        <div class="system-info">
                    <pre>
████████╗███████╗██████╗ ██╗     ██╗███╗   ██╗ █████╗ ██╗     
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                    </pre>
                    <div class="welcome-text">
                        <p>Welcome to Terminal CLI Template</p>
                        <p>Type /help to see available commands</p>
                        <p>Keyboard shortcuts: Ctrl+L (clear), Ctrl+C (clear input)</p>
                    </div>
        </div>
    `;
}

function addMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    output.appendChild(messageDiv);
    scrollToBottom();
}



function scrollToBottom(force = false) {
    if (!isUserScrolling || force) {
        requestAnimationFrame(() => {
            output.scrollTop = output.scrollHeight;
        });
    }
}

function smoothScrollToBottom() {
    const start = output.scrollTop;
    const end = output.scrollHeight - output.clientHeight;
    const duration = 300;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        output.scrollTop = start + (end - start) * easeOutCubic;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}



document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'c') {
        input.value = '';
        e.preventDefault();
    }
    
    if (e.ctrlKey && e.key === 'l') {
        clearOutput();
        e.preventDefault();
    }
    
    if (e.key === 'PageUp') {
        isUserScrolling = true;
        output.scrollTop -= output.clientHeight * 0.8;
        e.preventDefault();
    }
    
    if (e.key === 'PageDown') {
        isUserScrolling = true;
        output.scrollTop += output.clientHeight * 0.8;
        e.preventDefault();
    }
    
    if (e.key === 'End' && e.ctrlKey) {
        isUserScrolling = false;
        smoothScrollToBottom();
        e.preventDefault();
    }
    
    if (e.key === 'Home' && e.ctrlKey) {
        isUserScrolling = true;
        output.scrollTop = 0;
        e.preventDefault();
    }
});
