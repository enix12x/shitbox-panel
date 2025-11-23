let backendUrl = 'http://localhost:3000';
let computers = [];
let branding = 'Shitbox Panel';

async function loadFrontendConfig() {
  try {
    const response = await fetch('config.json');
    if (!response.ok) {
      throw new Error('Failed to load frontend config');
    }
    const config = await response.json();
    backendUrl = config.backendUrl || backendUrl;
    loadBackendConfig();
  } catch (error) {
    console.error('Error loading frontend config:', error);
    loadBackendConfig();
  }
}

// get branding and computers from backend
async function loadBackendConfig() {
  try {
    const response = await fetch(`${backendUrl}/api/config`);
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    const data = await response.json();
    branding = data.branding;
    computers = data.computers;
    
    document.getElementById('branding').textContent = branding;
    document.title = branding;
    
    const select = document.getElementById('computerSelect');
    select.innerHTML = '<option value="">Select a computer...</option>';
    computers.forEach(comp => {
      const option = document.createElement('option');
      option.value = comp.ip;
      option.textContent = comp.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading backend config:', error);
    showAlert(`Error connecting to server at ${backendUrl}. Make sure the backend is running.`, 'danger');
  }
}

loadFrontendConfig();

document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const computer = document.getElementById('computerSelect').value;
  const message = document.getElementById('messageInput').value;
  const sendButton = document.getElementById('sendButton');
  
  if (!computer || !message) {
    showAlert('Please select a computer and enter a message', 'warning');
    return;
  }
  
  sendButton.disabled = true;
  sendButton.textContent = 'Sending...';
  
  try {
    const response = await fetch(`${backendUrl}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ computer, message })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }
    

    showAlert(data.message || 'Message sent!', 'success');
    document.getElementById('messageInput').value = '';
    
  } catch (error) {
    console.error('Error sending message:', error);
    showAlert(error.message || 'Error sending message', 'danger');
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
  }
});

function showAlert(message, type) {
  const container = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  container.innerHTML = '';
  container.appendChild(alert);
  
  if (type === 'success') {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 3000);
  }
}

