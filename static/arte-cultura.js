document.addEventListener("DOMContentLoaded", async () => {
    const lista = document.getElementById("arte-cultura-lista");
  
    async function carregarConteudos() {
      try {
        const res = await fetch("/contents");
        const data = await res.json();
  
        const filtrados = data.filter(item => item.category === "IA na Arte e Cultura");
  
        if (filtrados.length === 0) {
          lista.innerHTML = "<p>Nenhum conteúdo encontrado.</p>";
          return;
        }
  
        lista.innerHTML = "";
  
        filtrados.forEach(doc => {
          const item = document.createElement("section");
          item.className = "content-item";
  
          item.innerHTML = `
            <div class="content-image">
              <img src="./img/default.jpg" alt="${doc.title}" class="img-ajustada">
            </div>
            <div class="content-text">
              <h2 class="content-title">${doc.title}</h2>
              <p class="content-description">${doc.description}</p>
              <p class="content-credits">📌 Postado por Synthetica IA</p>
              <a href="#" class="saiba-mais">Saiba Mais +</a>
            </div>
          `;
  
          lista.appendChild(item);
        });
      } catch (err) {
        lista.innerHTML = "<p>Erro ao carregar conteúdos.</p>";
        console.error(err);
      }
    }
  
    carregarConteudos();
  });
  