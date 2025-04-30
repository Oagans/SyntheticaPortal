document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("doc-form");
  const list = document.getElementById("doc-list");

  let documentos = [];
  let editingId = null;

  function renderList() {
    list.innerHTML = "";
    documentos.forEach((doc) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${doc.title}</strong>
        <p>${doc.description}</p>
        <em>${doc.category}</em>
        <div style="margin-top: 0.5rem;">
          <button type="button" onclick="editDoc(${doc.id})">Editar</button>
          <button type="button" onclick="deleteDoc(${doc.id})" style="margin-left: 0.5rem;">Excluir</button>
        </div>
      `;
      li.classList.add("doc-item");
      list.appendChild(li);
    });
  }

  async function fetchDocs() {
    const res = await fetch("/contents");
    documentos = await res.json();
    renderList();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("categoria").value;

    const payload = { title, description, category };

    if (editingId) {
      await fetch(`/contents/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      editingId = null;
    } else {
      await fetch("/contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    form.reset();
    await fetchDocs();
  });

  window.editDoc = async function (id) {
    const doc = documentos.find((d) => d.id === id);
    if (!doc) return;
    console.log (document.getElementById("title"))
    document.getElementById("title").value = doc.title;
    document.getElementById("description").value = doc.description;
    document.getElementById("categoria").value = doc.category;
    editingId = id;
  };

  window.deleteDoc = async function (id) {
    await fetch(`/contents/${id}`, { method: "DELETE" });
    await fetchDocs();
  };

  fetchDocs();
});
