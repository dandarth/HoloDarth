<<<<<<< HEAD
const clientId = "typo17o14snn5x63zo9arsngh0bx5x"; // Seu Client ID da Twitch
const accessToken = "xf1hmscyaxnb8eotmnl4hyv1sz86x1"; // 🚀 Substitua pelo OAuth Token gerado!
const redirectUri = "https://dandarth.github.io/HoloDarth/"; // URL OAuth configurada

// 🔹 Lista de canais favoritos **corrigida**
const canaisFavoritos = ["serenohope", "ig_dan_ig", "jappatv"]; // 🔥 Substitua pelos nomes dos canais reais!

function carregarFavoritos() {
    document.getElementById('streamsContainer').innerHTML = ""; // 🔥 Garante que os canais anteriores são apagados antes de carregar
    canaisFavoritos.forEach((canal) => {
        addStream(canal);
    });
}

// 🔥 Corrigindo a função `addStream()` para funcionar corretamente!
function addStream(canal) {
    if (!canal) {
        canal = document.getElementById('channelName').value.trim();
    }

    if (!canal) {
        alert("Por favor, insira um nome de canal válido!");
        return;
    }

    let div = document.createElement("div"); 
    div.classList.add("stream-container");

    let iframe = document.createElement("iframe");
    iframe.src = `https://player.twitch.tv/?channel=${canal}&parent=dandarth.github.io&muted=true`;

    let chatIframe = document.createElement("iframe");
    chatIframe.src = `https://www.twitch.tv/embed/${canal}/chat?parent=dandarth.github.io`;
    chatIframe.width = "100%";
    chatIframe.height = "400";
    chatIframe.frameBorder = "0";

    div.appendChild(iframe);
    document.getElementById('streamsContainer').appendChild(div);
    document.getElementById('chatContainer').appendChild(chatIframe);

    document.getElementById('channelName').value = ""; // 🔥 Limpa o campo de entrada após adicionar
}

// 🔥 Adicionando evento de "Enter" no campo de entrada
document.getElementById("channelName").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addStream();
    }
});

// 🔥 Corrigindo o botão "Adicionar Stream"
document.querySelector("button[onclick='addStream()']").addEventListener("click", function() {
    addStream();
});

// 🔥 Atualiza as streams a cada 15 minutos
setInterval(refreshStreams, 900000);

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
=======
const clientId = "typo17o14snn5x63zo9arsngh0bx5x"; // Seu Client ID da Twitch
const accessToken = "xf1hmscyaxnb8eotmnl4hyv1sz86x1"; // 🚀 Substitua pelo OAuth Token gerado!
const redirectUri = "https://dandarth.github.io/HoloDarth/"; // URL OAuth configurada

// 🔹 Lista de canais favoritos **corrigida**
const canaisFavoritos = ["serenohope", "ig_dan_ig", "jappatv"]; // 🔥 Substitua pelos nomes dos canais reais!

function carregarFavoritos() {
    document.getElementById('streamsContainer').innerHTML = ""; // 🔥 Garante que os canais anteriores são apagados antes de carregar
    canaisFavoritos.forEach((canal) => {
        addStream(canal);
    });
}

// 🔥 Corrigindo a função `addStream()` para funcionar corretamente!
function addStream(canal) {
    if (!canal) {
        canal = document.getElementById('channelName').value.trim();
    }

    if (!canal) {
        alert("Por favor, insira um nome de canal válido!");
        return;
    }

    let div = document.createElement("div"); 
    div.classList.add("stream-container");

    let iframe = document.createElement("iframe");
    iframe.src = `https://player.twitch.tv/?channel=${canal}&parent=dandarth.github.io&muted=true`;

    let chatIframe = document.createElement("iframe");
    chatIframe.src = `https://www.twitch.tv/embed/${canal}/chat?parent=dandarth.github.io`;
    chatIframe.width = "100%";
    chatIframe.height = "400";
    chatIframe.frameBorder = "0";

    div.appendChild(iframe);
    document.getElementById('streamsContainer').appendChild(div);
    document.getElementById('chatContainer').appendChild(chatIframe);

    document.getElementById('channelName').value = ""; // 🔥 Limpa o campo de entrada após adicionar
}

// 🔥 Adicionando evento de "Enter" no campo de entrada
document.getElementById("channelName").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addStream();
    }
});

// 🔥 Corrigindo o botão "Adicionar Stream"
document.querySelector("button[onclick='addStream()']").addEventListener("click", function() {
    addStream();
});

// 🔥 Atualiza as streams a cada 15 minutos
setInterval(refreshStreams, 900000);

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
>>>>>>> 512c27a (Inicializando repositório Git)
