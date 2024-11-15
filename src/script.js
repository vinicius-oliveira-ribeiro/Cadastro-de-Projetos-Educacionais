document.addEventListener('DOMContentLoaded', function () {
    // Função para buscar os dados da API
    fetch('http://127.0.0.1:3333/projetos') // Substitua pela URL correta da sua API
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados');
            }
            return response.json(); // Retorna os dados no formato JSON
        })
        .then(data => {
            // Obtém o elemento onde o JSON será exibido
            const resultadoConsulta = document.getElementById('resultado-consulta');

            // Exibe os dados do JSON na página
            resultadoConsulta.textContent = JSON.stringify(data, null, 4);  // Formata o JSON com indentação de 4 espaços
        })
        .catch(error => {
            console.error('Erro:', error);
            const resultadoConsulta = document.getElementById('resultado-consulta');
            resultadoConsulta.textContent = 'Erro ao carregar os dados. Tente novamente mais tarde.';
        });

    // Escuta o evento de envio do formulário
    document.getElementById('form-projeto').addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const form = event.target;
        const formData = new FormData(form);
        const jsonData = {};

        // Mapear os dados do formulário para JSON
        for (const [key, value] of formData.entries()) {
            jsonData[key] = value.trim(); // Remove espaços extras
        }

        // Validação dos campos
        let isValid = true;

        // Função para validar cada campo
        function validateField(fieldId, errorMessageId, errorMessage) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(errorMessageId);

            if (!jsonData[fieldId]) {
                field.classList.add('error');
                errorElement.textContent = errorMessage;
                isValid = false;
            } else {
                field.classList.remove('error');
                errorElement.textContent = '';
            }
        }

        // Validação dos campos obrigatórios
        validateField('projeto', 'projeto-error', 'O campo "Projeto" é obrigatório.');
        validateField('serie', 'serie-error', 'O campo "Série" é obrigatório.');
        validateField('professor', 'professor-error', 'O campo "Professor" é obrigatório.');
        validateField('descricao', 'descricao-error', 'O campo "Descrição" é obrigatório.');
        validateField('dataInicio', 'dataInicio-error', 'O campo "Data Início" é obrigatório.');
        validateField('dataFim', 'dataFim-error', 'O campo "Data Fim" é obrigatório.');

        // Se algum campo for inválido, interrompe o envio
        if (!isValid) {
            document.getElementById('mensagem').textContent = 'Preencha todos os campos obrigatórios.';
            return;
        }

        console.log('Dados do formulário:', jsonData);

        // Envia os dados ao servidor
        fetch('http://127.0.0.1:3333/projetos', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('Status da resposta:', response.status);
                if (response.ok) {
                    console.log('Resposta do servidor:', response);
                    document.getElementById('mensagem').textContent = 'Formulário enviado com sucesso!';
                    setTimeout(() => {
                        location.reload(); // Recarrega a página após 5 segundos
                    }, 5000);
                } else {
                    console.error('Erro ao enviar o formulário:', response.statusText);
                    document.getElementById('mensagem').textContent =
                        'Erro ao enviar o formulário. Por favor, tente novamente.';
                }
            })
            .catch((err) => {
                console.error('Erro ao enviar a requisição:', err);
                document.getElementById('mensagem').textContent =
                    'Erro ao enviar o formulário. Por favor, tente novamente.';
            });
    });
});
