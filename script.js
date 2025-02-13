const API_URL = "http://localhost:3000/locais";

const form = document.getElementById("formLocal");
const listaLocais = document.getElementById("listaLocais");
const tituloInput = document.getElementById("titulo");
const descricaoInput = document.getElementById("descricao");
const fotoInput = document.getElementById("foto");

let editando = false;
let idAtual = null;

async function carregarLocais() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar locais");
        const locais = await response.json();
        listaLocais.innerHTML = "";

        locais.forEach((local) => {
            const div = document.createElement("div");
            div.className = "local";
            div.innerHTML = `
        <h2>${local.titulo}</h2>
        <p>${local.descricao}</p>
        <img src="${local.foto}" alt="${local.titulo}">
        <button onclick="editarLocal('${local.id}')">Editar</button>
        <button onclick="excluirLocal('${local.id}')">Excluir</button>
      `;
            listaLocais.appendChild(div);
        });
    } catch (error) {
        console.error("Erro:", error);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const local = {
        titulo: tituloInput.value,
        descricao: descricaoInput.value,
        foto: fotoInput.value,
    };
    try {
        if (editando) {
            await fetch(`${API_URL}/${idAtual}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(local),
            });
            editando = false;
            idAtual = null;
        } else {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(local),
            });
        }

        form.reset();
        carregarLocais();
    } catch (error) {
        console.error("Erro:", error);
    }
});
async function editarLocal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Erro ao carregar local");
        const local = await response.json();

        tituloInput.value = local.titulo;
        descricaoInput.value = local.descricao;
        fotoInput.value = local.foto;

        tituloInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

        editando = true;
        idAtual = id;
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function excluirLocal(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        carregarLocais();
    } catch (error) {
        console.error("Erro:", error);
    }
}

carregarLocais();