const clientId = "typo17o14snn5x63zo9arsngh0bx5x";
const accessToken = "xf1hmscyaxnb8eotmnl4hyv1sz86x1";

let canaisFavoritos = JSON.parse(localStorage.getItem("canaisFavoritos")) || [];

function carregarFavoritos() {
    document.getElementById('streamsContainer').innerHTML = "";
    document.getElementById('chatContainer').innerHTML = "";

    canaisFavoritos.forEach((canal) => {
        addStream(canal);
    });
}

function addStream(canal) {
    if (!canal) {
        canal = document.getElementById('channelName').value.trim();
    }

    if (!canal) {
        alert("Por favor, insira um nome de canal válido!");
        return;
    }

    // Evita duplicação
    if (canaisFavoritos.includes(canal)) return;

    canaisFavoritos.push(canal);
    localStorage.setItem("canaisFavoritos", JSON.stringify(canaisFavoritos));

    let div = document.createElement("div");
    div.classList.add("stream-container");

    let iframe = document.createElement("iframe");
    iframe.src = `https://player.twitch.tv/?channel=${canal}&parent=dandarth.github.io&muted=true`;
    iframe.width = "100%";
    iframe.height = "400";
    iframe.allowFullscreen = true;

    let chatIframe = document.createElement("iframe");
    chatIframe.src = `https://www.twitch.tv/embed/${canal}/chat?parent=dandarth.github.io`;
    chatIframe.width = "100%";
    chatIframe.height = "500";
    chatIframe.frameBorder = "0";

    let removeButton = document.createElement("button");
    removeButton.innerText = "Remover Live";
    removeButton.classList.add("remove-stream-btn");
    removeButton.onclick = function() {
        removerStream(div, canal);
    };

    div.appendChild(iframe);
    div.appendChild(removeButton);
    document.getElementById('streamsContainer').appendChild(div);
    document.getElementById('chatContainer').appendChild(chatIframe);

    document.getElementById('channelName').value = "";
}

function removerStream(streamDiv, canal) {
    streamDiv.remove();

    const chatIframe = Array.from(document.querySelectorAll('#chatContainer iframe'))
        .find(iframe => iframe.src.includes(`/${canal}/chat`));

    if (chatIframe) chatIframe.remove();

    canaisFavoritos = canaisFavoritos.filter(c => c !== canal);
    localStorage.setItem("canaisFavoritos", JSON.stringify(canaisFavoritos));
}

function toggleChat() {
    const chatSidebar = document.getElementById("chatSidebar");
    chatSidebar.style.display = chatSidebar.style.display === "none" ? "flex" : "none";
}

async function buscarStreamsPorTag(tag) {
    const query = encodeURIComponent(tag);
    const url = `https://api.twitch.tv/helix/search/channels?query=${query}&live_only=true`;

    try {
        const response = await fetch(url, {
            headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (!data.data) return [];

        return data.data
            .filter(channel => channel.is_live && channel.title.includes(tag))
            .map(channel => channel.broadcaster_login);

    } catch (err) {
        console.error("Erro ao buscar streams por tag:", err);
        return [];
    }
}

async function atualizarStreamsPorTag(tag) {
    const canais = await buscarStreamsPorTag(tag);
    canais.forEach(canal => {
        if (!canaisFavoritos.includes(canal)) {
            addStream(canal);
        }
    });
}

async function atualizarStreamsPorTags() {
    try {
        const response = await fetch('equipes.json');
        const data = await response.json();
        const tags = data.equipes;

        for (const tag of tags) {
            await atualizarStreamsPorTag(tag);
        }
    } catch (err) {
        console.error('Erro ao carregar equipes.json:', err);
    }
}

function carregarEquipeTwitchPorTags() {
    atualizarStreamsPorTags();
}

function carregarCanaisFavoritos() {
    carregarFavoritos();
}

// 🔧 GARANTE que o DOM esteja pronto antes de acessar os elementos
window.addEventListener("DOMContentLoaded", () => {
    carregarFavoritos();

    const input = document.getElementById("channelName");
    if (input) {
        input.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                addStream(input.value.trim());
            }
        });
    }

    atualizarStreamsPorTags();
    setInterval(atualizarStreamsPorTags, 5 * 60 * 1000); // Atualiza a cada 5 minutos
});

// 🌐 Torna funções acessíveis no HTML (botões onclick)
window.addStream = addStream;
window.carregarCanaisFavoritos = carregarCanaisFavoritos;
window.carregarEquipeTwitchPorTags = carregarEquipeTwitchPorTags;
