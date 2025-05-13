const clientId = "typo17o14snn5x63zo9arsngh0bx5x"; // Seu Client ID da Twitch
const accessToken = "xf1hmscyaxnb8eotmnl4hyv1sz86x1"; // 🚀 Substitua pelo OAuth Token gerado!
const redirectUri = "https://dandarth.github.io/HoloDarth/"; // URL OAuth configurada

// 🔹 Carregar canais favoritos do Local Storage ou criar lista vazia
let canaisFavoritos = JSON.parse(localStorage.getItem("canaisFavoritos")) || [];

function carregarFavoritos() {
    document.getElementById('streamsContainer').innerHTML = ""; // 🔥 Limpa a tela antes de carregar

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

    let div = document.createElement("div");
    div.classList.add("stream-container");

    let iframe = document.createElement("iframe");
    iframe.src = `https://player.twitch.tv/?channel=${canal}&parent=dandarth.github.io&muted=true`;
    iframe.width = "100%";
    iframe.height = "400"; // 🔥 Ajustando altura do player
    iframe.allowFullscreen = true;

    let chatIframe = document.createElement("iframe");
    chatIframe.src = `https://www.twitch.tv/embed/${canal}/chat?parent=dandarth.github.io`;
    chatIframe.width = "100%";
    chatIframe.height = "500";
    chatIframe.frameBorder = "0";

    let removeButton = document.createElement("button");
    removeButton.innerText = "Remover Live";
    removeButton.classList.add("remove-stream-btn"); // 🔥 Adicionando classe para estilização
    removeButton.onclick = function() {
        removerStream(div);
    };

    div.appendChild(iframe);
    div.appendChild(removeButton);
    document.getElementById('streamsContainer').appendChild(div);
    document.getElementById('chatContainer').appendChild(chatIframe);

    document.getElementById('channelName').value = "";
}

// 🔹 Função para remover a live da tela, mantendo na lista de favoritos
function removerStream(streamDiv) {
    streamDiv.remove(); // 🔥 Apenas remove a live exibida, sem alterar favoritos
}

// 🔹 Adicionar um canal favorito manualmente e salvar no Local Storage
function addFavoriteChannel() {
    let canal = document.getElementById("favoriteChannel").value.trim();

    if (!canal) {
        alert("Por favor, insira um nome de canal válido!");
        return;
    }

    // 🔥 Evita duplicação de favoritos
    if (!canaisFavoritos.includes(canal)) {
        canaisFavoritos.push(canal);
        localStorage.setItem("canaisFavoritos", JSON.stringify(canaisFavoritos));
        alert(`Canal ${canal} adicionado aos favoritos!`);
    } else {
        alert("Esse canal já está nos favoritos!");
    }

    // 🔥 Atualiza a lista na tela automaticamente
    carregarFavoritos();
    document.getElementById("favoriteChannel").value = ""; // 🔥 Limpa o campo após adicionar
}

// 🔥 Recarrega os canais favoritos ao carregar a página
window.onload = carregarFavoritos;