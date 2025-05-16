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

    const chatIframe = Array.from(document.querySelectorAll('#chatContainer iframe'))
        .find(iframe => iframe.src.includes(`/${canal}/chat`));

    if (chatIframe) {
        chatIframe.remove();
    }
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

async function getTeamMembers(teamName) {
    const url = `https://api.twitch.tv/helix/teams?name=${teamName}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        return data.data?.[0]?.users?.map(user => user.user_login) || [];
    } catch (err) {
        console.error('Erro ao buscar membros da equipe:', err);
        return [];
    }
}

async function isChannelOnline(channelName) {
    const url = `https://api.twitch.tv/helix/streams?user_login=${channelName}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        return data.data && data.data.length > 0;
    } catch (err) {
        console.error('Erro ao checar status do canal:', err);
        return false;
    }
}

async function checkTeamsAndAddStreams() {
    try {
        const response = await fetch('equipes.json');
        const data = await response.json();
        const teams = data.equipes;

        for (const team of teams) {
            const cleanTeam = team.startsWith("@") ? team.substring(1) : team;
            const membros = await getTeamMembers(cleanTeam);

            for (const member of membros) {
                const online = await isChannelOnline(member);
                if (online) {
                    if (!canaisFavoritos.includes(member)) {
                        canaisFavoritos.push(member);
                        localStorage.setItem("canaisFavoritos", JSON.stringify(canaisFavoritos));
                    }
                    addStream(member);
                }
            }
        }
    } catch (err) {
        console.error('Erro ao carregar equipes e adicionar streams:', err);
    }
}

window.addEventListener("DOMContentLoaded", function () {
    carregarFavoritos();

    document.getElementById("channelName").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            addStream(document.getElementById("channelName").value.trim());
        }
    });

    checkTeamsAndAddStreams();
    setInterval(checkTeamsAndAddStreams, 5 * 60 * 1000); // a cada 5 minutos
});
