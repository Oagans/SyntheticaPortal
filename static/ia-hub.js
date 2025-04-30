function sendMessage() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  console.log('Mensagem para IA:', message);

  input.value = '';
}

