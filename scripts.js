function addStream() {
    const canal = document.getElementById("channelName").value.trim();
    if (!canal) {
        alert("Digite o nome de um canal.");
        return;
    }

    const div = document.createElement("div");
    div.textContent = `Live adicionada: ${canal}`;
    div.style.padding = "10px";
    div.style.background = "#222";
    div.style.margin = "5px";
    div.style.color = "#fff";

    document.getElementById("streamsContainer").appendChild(div);
    document.getElementById("channelName").value = "";
}

function carregarCanaisFavoritos() {
    alert("Canais favoritos carregados!");
}

function carregarEquipeTwitchPorTags() {
    alert("Carregando tags...");
}

function toggleChat() {
    const el = document.getElementById("chatSidebar");
    el.style.display = el.style.display === "none" ? "flex" : "none";
}

// ✅ Registrar funções no escopo global (ESSENCIAL)
window.addStream = addStream;
window.carregarCanaisFavoritos = carregarCanaisFavoritos;
window.carregarEquipeTwitchPorTags = carregarEquipeTwitchPorTags;
window.toggleChat = toggleChat;
