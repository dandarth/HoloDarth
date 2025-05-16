const clientId = "typo17o14snn5x63zo9arsngh0bx5x";
const accessToken = "xf1hmscyaxnb8eotmnl4hyv1sz86x1";

let canaisFavoritos = JSON.parse(localStorage.getItem("canaisFavoritos")) || [];

// Carrega canais favoritos do localStorage e exibe
function carregarFavoritos() {
    document.getElementById('streamsContainer').innerHTML = "";
    document.getElementById('chatContainer').innerHTML = "";

    canaisFavoritos.forEach((canal) => {
        addStream(canal);
    });
}

// Adiciona uma live e chat na tela e salva nos favoritos
function addStream(canal) {
    if (!canal) {
        canal = document.getElementById('channelName').value.trim();
    }

    if (!canal) {
        alert("Por favor, insira um nome de canal válido!");
        return;
    }

    // Evita duplicação
    if (canaisFavoritos.includes(canal)) {
        return;
    }

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

// Remove live e chat da tela e dos favoritos
function removerStream(streamDiv, canal) {
    streamDiv.remove();

    const chatIframe = Array.from(document.querySelectorAll('#chatContainer iframe'))
        .find(iframe => iframe.src.includes(`/${canal}/chat`));

    if (chatIframe) {
        chatIframe.remove();
    }

    canaisFavoritos = canaisFavoritos.filter(c => c !== canal);
    localStorage.setItem("canaisFavoritos", JSON.stringify(canaisFavoritos));
}

// Botão para adicionar canal manualmente nos favoritos
function addFavoriteChannel() {
    let canal = document.getElementById("favoriteChannel").value.trim();

    if (!canal) {
        alert("Por favor, insira um nome de canal válido!");
        return;
    }

    if (!canaisFavoritos.includes(canal)) {
        canaisFavoritos.push(canal);
        localStorage.setItem("canaisFavoritos", JSON.stringify(canaisFavoritos));
        alert(`Canal ${canal} adicionado aos favoritos!`);
    } else {
        alert("Esse canal já está nos favoritos!");
    }

    carregarFavoritos();
    document.getElementById("favoriteChannel").value = "";
}

// Toggle de exibir/ocultar chat lateral
function toggleChat() {
    const chatSidebar = document.getElementById("chatSidebar");
    if (chatSidebar.style.display === "none") {
        chatSidebar.style.display = "flex";
    } else {
        chatSidebar.style.display = "none";
    }
}

// Busca canais ao vivo com a tag no título da live via Twitch API
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

        // Filtra canais que tenham a tag no título da live
        return data.data
            .filter(channel => channel.is_live && channel.title.includes(tag))
            .map(channel => channel.broadcaster_login);

    } catch (err) {
        console.error("Erro ao buscar streams por tag:", err);
        return [];
    }
}

// Atualiza lista de streams ao vivo para a tag dada
async function atualizarStreamsPorTag(tag) {
    const canais = await buscarStreamsPorTag(tag);

    canais.forEach(canal => {
        if (!canaisFavoritos.includes(canal)) {
            addStream(canal);
        }
    });
}

// Lê o equipes.json e atualiza streams para todas as tags
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

// Função para carregar equipes via tags (chamada pelo botão)
function carregarEquipeTwitchPorTags() {
    atualizarStreamsPorTags();
}

// Função para carregar canais favoritos (chamada pelo botão)
function carregarCanaisFavoritos() {
    carregarFavoritos();
}

// Inicialização ao carregar a página
window.addEventListener("DOMContentLoaded", function () {
    carregarFavoritos();

    document.getElementById("channelName").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            addStream(document.getElementById("channelName").value.trim());
        }
    });

    atualizarStreamsPorTags();
    setInterval(atualizarStreamsPorTags, 5 * 60 * 1000); // Atualiza a cada 5 minutos
});

// Expõe as funções globais para uso no HTML
window.addStream = addStream;
window.carregarCanaisFavoritos = carregarCanaisFavoritos;
window.carregarEquipeTwitchPorTags = carregarEquipeTwitchPorTags;
window.toggleChat = toggleChat;
