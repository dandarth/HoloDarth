
const clientId = "typo17o14snn5x63zo9arsngh0bx5x";
const accessToken = "xf1hmscyaxnb8eotmnl4hyv1sz86x1";
const redirectUri = "https://dandarth.github.io/HoloDarth/";

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

    const chatIframes = document.querySelectorAll(`#chatContainer iframe`);
    chatIframes.forEach((iframe) => {
        if (iframe.src.includes(canal)) {
            iframe.remove();
        }
    });
}

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

function toggleChat() {
    const chatSidebar = document.getElementById("chatSidebar");
    if (chatSidebar.style.display === "none") {
        chatSidebar.style.display = "flex";
    } else {
        chatSidebar.style.display = "none";
    }
}

async function carregarEquipe() {
    const teamName = "nome_da_equipe"; // Substitua pelo nome real da equipe

    const url = `https://api.twitch.tv/helix/teams?name=${teamName}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const membros = data.data[0].users;
            membros.forEach(member => {
                addStream(member.user_name);
            });
        } else {
            alert("Equipe não encontrada.");
        }
    } catch (error) {
        console.error("Erro ao carregar equipe:", error);
    }
}

window.onload = function () {
    carregarFavoritos();

    document.getElementById("channelName").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            addStream(document.getElementById("channelName").value.trim());
        }
    });
};
