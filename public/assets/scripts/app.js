const API_URL = 'http://localhost:3000/eventos';

// Função para buscar todos os eventos da api
async function getEventos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar eventos.');
        }
        const eventos = await response.json();
        return eventos;
    } catch (error) {
        console.error('Falha na requisição:', error);
        return [];
    }
}

// Função para buscar um evento específico por id
async function getEvento(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar evento.');
        }
        const evento = await response.json();
        return evento;
    } catch (error) {
        console.error('Falha na requisição:', error);
        return null;
    }
}

// Função que cria e insere o conteúdo do carrossel de eventos na home-page
async function montarCarrossel() {
    const container = document.getElementById('carrossel-eventos-inner');
    if (!container) return; 

    const eventos = await getEventos();
    container.innerHTML = ''; 

    eventos.forEach((evento, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <a href="detalhe.html?id=${evento.id}">
                <img src="${evento.imagem}" class="d-block w-100" alt="${evento.titulo}">
            </a>
            <div class="carousel-caption d-none d-md-block">
                <h5>${evento.titulo}</h5>
                <p>${evento.descricaoCurta}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

//Função para montar os cards de evento na home-page
async function montarCardsEventos() {
    const container = document.getElementById('eventos-container');
    if (!container) return; 

    const eventos = await getEventos();
    container.innerHTML = ''; 

    eventos.forEach(evento => {
        const card = document.createElement('div');
        card.className = 'col-lg-3 col-md-6 mb-4'; 
        card.innerHTML = `
            <article class="card h-100 shadow-sm">
                <img src="${evento.imagem}" class="card-img-top" alt="${evento.titulo}">
                <div class="card-body d-flex flex-column">
                    <h3 class="card-title">${evento.titulo}</h3>
                    <p class="card-text"><strong>Data:</strong> ${evento.data}</p>
                    <p class="card-text">${evento.descricaoCurta}</p>
                    <a href="detalhe.html?id=${evento.id}" class="btn btn-veja-mais w-100 mt-auto">Veja Mais</a>
                    <a href="cadastro_eventos.html?id=${evento.id}" class="btn btn-primary w-100 mt-2">Editar</a>
                    <button onclick="deleteEvento(${evento.id})" class="btn btn-danger w-100 mt-2">Excluir</button>
                </div>
            </article>
        `;
        container.appendChild(card);
    });
}

// Função para montar a página de detalhes
async function montarDetalhes() {
    const container = document.getElementById('detalhe-container');
    const galeriaContainer = document.getElementById('galeria-fotos');
    if (!container) return; 

    const params = new URLSearchParams(window.location.search);
    const eventoId = params.get('id');
    
    if (!eventoId) return; 

    const evento = await getEvento(eventoId);

    if (evento) {
        document.title = evento.titulo;
        container.innerHTML = `
            <div class="row g-5">
                <div class="col-lg-6">
                    <img src="${evento.imagem}" alt="${evento.titulo}" class="img-fluid rounded shadow-sm detalhe-img">
                </div>
                <div class="col-lg-6 d-flex flex-column">
                    <h2 class="detalhe-titulo mb-3">${evento.titulo}</h2>
                    <div class="detalhe-info">
                        <p><strong>Data:</strong> ${evento.data}</p>
                        <p><strong>Horário:</strong> ${evento.horario}</p>
                        <p><strong>Local:</strong> ${evento.local}</p>
                    </div>
                    <p class="mt-3">${evento.descricaoLonga}</p>
                    <div class="mt-auto">
                      <a href="index.html#eventos" class="btn btn-voltar">Voltar</a>
                    </div>
                </div>
            </div>
        `;

        // Condição que monta a galeria de fotos se o container existir e o evento tiver fotos
        if (galeriaContainer && evento.fotosDetalhes && evento.fotosDetalhes.length > 0) {
            const row = document.createElement('div');
            row.className = 'row g-4';

            evento.fotosDetalhes.forEach(fotoUrl => {
                const col = document.createElement('div');
                col.className = 'col-md-3 col-6';
                col.innerHTML = `<img src="${fotoUrl}" alt="Foto do Evento: ${evento.titulo}" class="img-fluid rounded shadow-sm">`;
                row.appendChild(col);
            });
            galeriaContainer.appendChild(row);
        }
    } 
}

// Função para deletar um evento
async function deleteEvento(id) {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir evento.');
            }

            // Recarrega a página para atualizar a lista
            location.reload(); 

        } catch (error) {
            console.error('Falha ao excluir:', error);
            alert('Não foi possível excluir o evento.');
        }
    }
}

// Função para inicializar a página de cadastro e edição
async function initCadastroPage() {
    const form = document.getElementById('form-evento');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const eventoId = params.get('id');

    const tituloForm = document.getElementById('titulo');
    const dataForm = document.getElementById('data');
    const horarioForm = document.getElementById('horario');
    const localForm = document.getElementById('local');
    const imagemForm = document.getElementById('imagem');
    const descricaoCurtaForm = document.getElementById('descricaoCurta');
    const descricaoLongaForm = document.getElementById('descricaoLonga');
    const fotosDetalhesForm = document.getElementById('fotosDetalhes');
    const formTitulo = document.getElementById('form-titulo');

    if (eventoId) {
        formTitulo.textContent = 'Editar Evento';
        const evento = await getEvento(eventoId);
        if (evento) {
            tituloForm.value = evento.titulo;
            dataForm.value = evento.data;
            horarioForm.value = evento.horario;
            localForm.value = evento.local;
            imagemForm.value = evento.imagem;
            descricaoCurtaForm.value = evento.descricaoCurta;
            descricaoLongaForm.value = evento.descricaoLonga;
            fotosDetalhesForm.value = evento.fotosDetalhes.join(','); 
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        // Coleta os dados do formulário
        const eventoData = {
            titulo: tituloForm.value,
            data: dataForm.value,
            horario: horarioForm.value,
            local: localForm.value,
            imagem: imagemForm.value,
            descricaoCurta: descricaoCurtaForm.value,
            descricaoLonga: descricaoLongaForm.value,
            fotosDetalhes: fotosDetalhesForm.value.split(',').map(foto => foto.trim()).filter(foto => foto) // Remove espaços e itens vazios
        };

        if (eventoId) {
            await updateEvento(eventoId, eventoData);
        } else {
            await createEvento(eventoData);
        }
    });
}

// Função para criar um novo evento
async function createEvento(eventoData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventoData),
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar evento.');
        }

        alert('Evento cadastrado com sucesso!');
        window.location.href = 'index.html#eventos';

    } catch (error) {
        console.error('Falha ao cadastrar:', error);
        alert('Não foi possível cadastrar o evento.');
    }
}

// Função para atualizar um evento existente
async function updateEvento(id, eventoData) {
     try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventoData),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar evento.');
        }

        alert('Evento atualizado com sucesso!');
        window.location.href = 'index.html#eventos';

    } catch (error) {
        console.error('Falha ao atualizar:', error);
        alert('Não foi possível atualizar o evento.');
    }
}

// Função de calendário - mapa para converter meses em números
const mesMap = {
    'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
    'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
    'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
};

function parsearDataEvento(dataStr) {
    const str = dataStr.toLowerCase();

    // Verifica a recorrência (dias da semana)
    if (str.includes('domingo')) return { daysOfWeek: [0] }; // 0 = Domingo
    if (str.includes('segunda')) return { daysOfWeek: [1] };
    if (str.includes('terça')) return { daysOfWeek: [2] };
    if (str.includes('quarta')) return { daysOfWeek: [3] };
    if (str.includes('quinta')) return { daysOfWeek: [4] };
    if (str.includes('sexta')) return { daysOfWeek: [5] };
    if (str.includes('sábado')) return { daysOfWeek: [6] };

    // Verifica data específica
    const parts = str.split(' de ');
    if (parts.length === 3) {
        const dia = parts[0].padStart(2, '0');
        const mes = mesMap[parts[1]];
        const ano = parts[2];
        
        if (dia && mes && ano) {
            return { start: `${ano}-${mes}-${dia}` };
        }
    }

    // Retorna vazio se não conseguir identificar
    return {};
}

// Inicializa o calendário
async function montarCalendario() {
    const calendarioEl = document.getElementById('calendario');
    if (!calendarioEl) return;

    const eventosApi = await getEventos();

    const eventosFormatados = eventosApi.map(evento => {
        const dataFormatada = parsearDataEvento(evento.data);
        return {
            title: evento.titulo,
            url: `detalhe.html?id=${evento.id}`,
            ...dataFormatada
        };
    });

    const calendar = new FullCalendar.Calendar(calendarioEl, {
        initialView: 'dayGridMonth', 
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        buttonText: { 
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            list: 'Lista'
        },
        events: eventosFormatados,
        eventClick: function(info) {
        }
    });

    calendar.render();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('detalhe-container')) {
        montarDetalhes();
    }
    if (document.getElementById('eventos-container')) {
        montarCarrossel();
        montarCardsEventos();
        montarCalendario();
    }
    if (document.getElementById('form-evento')) {
        initCadastroPage();
    }
});