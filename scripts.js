const clientId = "typo17o14snn5x63zo9arsngh0bx5x";
const accessToken = "xf1hmscyaxnb8eotmnl4hyv1sz86x1";

// Canais favoritos já adicionados manualmente
let canaisFavoritos = JSON.parse(localStorage.getItem("canaisFavoritos")) || [];

// Função para buscar membros da equipe via Twitch API
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

        if (data.data && data.data.length > 0) {
            // Aqui você precisa adaptar conforme retorno real da API,
            // pois o endpoint helix/teams pode não retornar membros diretamente.
            // Você pode precisar usar outra endpoint ou ter lista local dos canais.

            // Para exemplo, vamos assumir que o retorno tem um campo `users`
            return data.data[0].users.map(user => user.user_login);
        } else {
            console.warn(`Equipe ${teamName} não encontrada.`);
            return [];
        }
    } catch (err) {
        console.error('Erro ao buscar membros da equipe:', err);
        return [];
    }
}

// Função para checar se canal está online
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

// Função para carregar e adicionar canais online das equipes listadas
async function checkTeamsAndAddStreams() {
    try {
        const response = await fetch('equipes.json');
        const data = await response.json();
        const teams = data.equipes;

        for (const team of teams) {
            const membros = await getTeamMembers(team);

            for (const member of membros) {
                const online = await isChannelOnline(member);
                if (online) {
                    // Evita duplicação
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

// Inicializa com canais favoritos salvos
window.onload = function () {
    carregarFavoritos();

    document.getElementById("channelName").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            addStream(document.getElementById("channelName").value.trim());
        }
    });

    // Roda a checagem a cada 5 minutos
    checkTeamsAndAddStreams();
    setInterval(checkTeamsAndAddStreams, 5 * 60 * 1000);
};
