(function () {
  // Extract data attributes from the script tag
  const scriptTag = document.currentScript;
  const integrationToken = scriptTag.getAttribute('data-integration-token');
  const managerEmail = scriptTag.getAttribute('data-manager') || 'manager@example.com';
  let botPrompt = scriptTag.getAttribute('data-bot-prompt') || 'You are a helpful customer support bot.';

  if (!integrationToken) {
    console.error('[Agentops] Missing data-integration-token attribute. Chat widget will not function properly.');
  }

  // Create UI Container
  const container = document.createElement('div');
  container.id = 'agentops-chat-widget';
  
  const styles = `
    #agentops-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #agentops-chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    #agentops-chat-toggle:hover {
      transform: scale(1.05);
    }
    #agentops-chat-toggle svg {
      width: 30px;
      height: 30px;
      fill: currentColor;
    }
    #agentops-chat-window {
      display: none;
      width: 350px;
      height: 500px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border: 1px solid #e5e7eb;
      position: absolute;
      bottom: 80px;
      right: 0;
      flex-direction: column;
      overflow: hidden;
      animation: agentops-fade-in 0.3s ease-out;
    }
    @keyframes agentops-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #agentops-chat-header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      padding: 16px;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #agentops-chat-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 20px;
      opacity: 0.8;
    }
    #agentops-chat-close:hover {
      opacity: 1;
    }
    #agentops-chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f9fafb;
    }
    .agentops-message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }
    .agentops-message-user {
      background: #4f46e5;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .agentops-message-bot {
      background: #e5e7eb;
      color: #1f2937;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    #agentops-chat-input-container {
      display: flex;
      padding: 12px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
    #agentops-chat-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 14px;
      outline: none;
    }
    #agentops-chat-input:focus {
      border-color: #4f46e5;
    }
    #agentops-chat-send {
      background: none;
      border: none;
      color: #4f46e5;
      font-weight: 600;
      margin-left: 8px;
      cursor: pointer;
      padding: 8px 12px;
    }
    #agentops-chat-send:disabled {
      color: #9ca3af;
      cursor: not-allowed;
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  container.innerHTML = `
    <div id="agentops-chat-window">
      <div id="agentops-chat-header">
        <span>Support Chat</span>
        <button id="agentops-chat-close">&times;</button>
      </div>
      <div id="agentops-chat-messages">
        <div class="agentops-message agentops-message-bot">Hi there! How can I help you today?</div>
      </div>
      <div id="agentops-chat-input-container">
        <input type="text" id="agentops-chat-input" placeholder="Type your message..." />
        <button id="agentops-chat-send">Send</button>
      </div>
    </div>
    <button id="agentops-chat-toggle">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </button>
  `;

  document.body.appendChild(container);

  // Logic
  const toggleBtn = document.getElementById('agentops-chat-toggle');
  const windowEl = document.getElementById('agentops-chat-window');
  const closeBtn = document.getElementById('agentops-chat-close');
  const messagesEl = document.getElementById('agentops-chat-messages');
  const inputEl = document.getElementById('agentops-chat-input');
  const sendBtn = document.getElementById('agentops-chat-send');

  let isOpen = false;

  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    windowEl.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) inputEl.focus();
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    windowEl.style.display = 'none';
  });

  function appendMessage(text, sender) {
    const msgEl = document.createElement('div');
    msgEl.className = `agentops-message agentops-message-${sender}`;
    msgEl.textContent = text;
    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    inputEl.value = '';
    inputEl.disabled = true;
    sendBtn.disabled = true;

    // Send securely to the proxy API instead of raw webhook
    try {
      // Find where this script is hosted to call the API on the same origin,
      // or default to localhost if testing.
      const scriptUrl = new URL(scriptTag.src);
      const backendBaseUrl = scriptUrl.origin;
      
      const response = await fetch(`${backendBaseUrl}/api/automations/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-integration-token': integrationToken
        },
        body: JSON.stringify({
          message: text,
          userEmail: 'visitor@website.com',
          managerEmail: managerEmail,
          systemPrompt: botPrompt
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Handle n8n response format
        let reply = "Message sent successfully!";
        if (data.data && data.data.length > 0 && data.data[0].output) {
          reply = data.data[0].output;
        } else if (data.data && data.data.reply) {
          reply = data.data.reply;
        }
        appendMessage(reply, 'bot');
      } else {
        console.error('[Agentops] Webhook proxy error:', data);
        appendMessage('Sorry, I encountered an error. Please try again later.', 'bot');
      }
    } catch (err) {
      console.error('[Agentops] Network error:', err);
      appendMessage('Sorry, network error. Please try again.', 'bot');
    } finally {
      inputEl.disabled = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

})();
