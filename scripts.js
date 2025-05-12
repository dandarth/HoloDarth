const clientId = "typo17o14snn5x63zo9arsngh0bx5x"; // Seu Client ID da Twitch
const accessToken = "xf1hmscyaxnb8eotmnl4hyv1sz86x1"; // 🚀 Substitua pelo OAuth Token gerado!
const redirectUri = "https://dandarth.github.io/HoloDarth/"; // URL OAuth configurada

const canaisFavoritos = ["canal1", "canal2", "canal3"];

function carregarFavoritos() {
    canaisFavoritos.forEach((canal) => {
        addStreamFavorito(canal);
    });
}

async function carregarEquipe() {
    let teamName = prompt("Digite o nome da equipe da Twitch:");
    if (!teamName) return;

    const url = `https://api.twitch.tv/helix/teams?name=${teamName}`;

    const response = await fetch(url, {
        headers: {
            "Client-ID": clientId,
            "Authorization": `Bearer ${accessToken}` // ✅ Token de acesso incluído corretamente
        }
    });

    if (!response.ok) {
        alert("Erro ao carregar equipe!");
        return;
    }

    const data = await response.json();
    const membros = data.data[0].users.map(user => user.user_name);

    membros.forEach((canal) => {
        addStreamFavorito(canal);
    });
}

function addStreamFavorito(channel) {
    let div = document.createElement("div"); 
    div.classList.add("stream-container");

    let iframe = document.createElement("iframe");
    iframe.src = `https://player.twitch.tv/?channel=${channel}&parent=dandarth.github.io&muted=true`; // ✅ Configuração correta do parent

    let chatIframe = document.createElement("iframe");
    chatIframe.src = `https://www.twitch.tv/embed/${channel}/chat?parent=dandarth.github.io`; // ✅ Corrigido para evitar erro de segurança
    chatIframe.width = "100%";
    chatIframe.height = "400";
    chatIframe.frameBorder = "0";

    div.appendChild(iframe);
    document.getElementById('streamsContainer').appendChild(div);
    document.getElementById('chatContainer').appendChild(chatIframe);
}

function refreshStreams() {
    let iframes = document.querySelectorAll(".stream-container iframe:first-child");
    iframes.forEach((iframe) => {
        iframe.src = iframe.src;
    });
}

function toggleChat() {
    let chatSidebar = document.getElementById("chatSidebar");
    let toggleButton = document.getElementById("toggleChatButton");

    if (chatSidebar.style.transform === "translateX(0px)" || chatSidebar.style.transform === "") {
        chatSidebar.style.transform = "translateX(320px)";
        toggleButton.innerText = "Mostrar Chat";
    } else {
        chatSidebar.style.transform = "translateX(0px)";
        toggleButton.innerText = "Ocultar Chat";
    }
}

// Atualiza as streams a cada 15 minutos
setInterval(refreshStreams, 900000);