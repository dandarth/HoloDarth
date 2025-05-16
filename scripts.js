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

    const chat
