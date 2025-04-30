let sessionId = null;

// Torna a interface de IA visível
function abrirSynth() {
  const synth = document.getElementById("synth-interface");
  if (synth) {
    synth.style.display = "flex";
    synth.scrollIntoView({ behavior: "smooth" });
  }
}

// Fecha a interface de IA
function fecharSynth() {
  const synth = document.getElementById("synth-interface");
  if (synth) {
    synth.style.display = "none";
  }
}

// Envia mensagem para IA /chat (com redirecionamentos e lógica de palavras-chave)
async function sendMessage() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  const chatContainer = document.getElementById('chat-messages');
  chatContainer.innerHTML += `<div class="bubble user">${message}</div>`;
  input.value = '';
  input.disabled = true;

  chatContainer.innerHTML += `<div class="bubble bot thinking">Synth está pensando...</div>`;

  const res = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  chatContainer.querySelector(".thinking")?.remove();
  chatContainer.innerHTML += `<div class="bubble bot">${data.reply}</div>`;
  input.disabled = false;

  if (data.action) {
    setTimeout(() => window.location.href = data.action, 2000);
  }
}

// Envia mensagem para IA /perguntar (com memória de conversa)
async function sendPergunta() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  const chatContainer = document.getElementById('chat-messages');
  chatContainer.innerHTML += `<div class="bubble user">${message}</div>`;
  input.value = '';
  input.disabled = true;

  chatContainer.innerHTML += `<div class="bubble bot thinking">Synth está pensando com memória...</div>`;

  const res = await fetch("http://127.0.0.1:8000/perguntar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, pergunta: message })
  });

  const data = await res.json();
  sessionId = data.session_id;

  chatContainer.querySelector(".thinking")?.remove();
  chatContainer.innerHTML += `<div class="bubble bot">${data.resposta}</div>`;
  input.disabled = false;
}

// Lista conteúdos por categoria
function filtrarCategoria(categoria) {
  fetch("http://127.0.0.1:8000/contents")
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("ia-lista-conteudos");
      lista.innerHTML = "";
      const filtrados = data.filter(item => item.category === categoria);
      if (filtrados.length === 0) {
        lista.innerHTML = "<li>Nenhum conteúdo nesta categoria.</li>";
        return;
      }
      filtrados.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${item.title}</strong><br />
          <em>${item.category}</em><br />
          <p>${item.description}</p>
        `;
        lista.appendChild(li);
      });
    });
}

// Posta conteúdo e redireciona automaticamente
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ia-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("ia-title").value;
      const description = document.getElementById("ia-description").value;
      const category = document.getElementById("ia-category").value;

      if (!title || !description || !category) {
        alert("Preencha todos os campos.");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category })
      });

      if (res.ok) {
        alert("Conteúdo postado com sucesso!");
        if (category === "Avanços Tecnológicos") {
          window.location.href = "/avancos.html";
        } else if (category === "IA na Cultura") {
          window.location.href = "/arte-cultura.html";
        } else {
          window.location.href = "/documentos";
        }
      } else {
        alert("Erro ao postar conteúdo.");
      }
    });
  }
});
