document.addEventListener('DOMContentLoaded', function () {
    const baseUrl ="https://cadastro-de-projetos-educacionais.onrender.com";
    
    function buscarProjetos() 
    {
        fetch(`${baseUrl}/projetos`) 
            .then(response => {
                if (!response.ok)
                {
                    throw new Error('Erro ao buscar os dados');
                }
                return response.json(); 
            })
            .then(data => {
                const resultadoConsulta = document.getElementById('resultado-consulta');

                
                resultadoConsulta.innerHTML = '';

                if (data.data && data.data.length > 0) 
                {
                    
                    data.data.forEach(projeto => {
                        const card = document.createElement('div');
                        card.classList.add('card');

                        card.innerHTML = `
                            <h3>${projeto.nome_projeto || 'Sem Título'}</h3>
                            <p><strong>ID:</strong> ${projeto.id}</p>
                            <p><strong>Série:</strong> ${projeto.serie || 'Não informado'}</p>
                            <p><strong>Professor:</strong> ${projeto.professor || 'Não informado'}</p>
                            <p><strong>Descrição:</strong> ${projeto.descricao || 'Não informado'}</p>
                            <p><strong>Data Início:</strong> ${projeto.data_inicio ? new Date(projeto.data_inicio).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                            <p><strong>Data Fim:</strong> ${projeto.data_fim ? new Date(projeto.data_fim).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                        `;
                       
                        resultadoConsulta.appendChild(card);
                    });
                } 
                else 
                {
                   
                    resultadoConsulta.textContent = 'Nenhum projeto encontrado.';
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                const resultadoConsulta = document.getElementById('resultado-consulta');
                resultadoConsulta.textContent = 'Erro ao carregar os dados. Tente novamente mais tarde.';
            });
    }
    
    buscarProjetos();
    
    document.getElementById('form-projeto').addEventListener('submit', function (event) 
    {
        event.preventDefault(); 

        const form = event.target;
        const formData = new FormData(form);
        const jsonData = {};

        for (const [key, value] of formData.entries()) 
        {
            jsonData[key] = value.trim();
        }

        let isValid = true;
       
        function validateField(fieldId, errorMessageId, errorMessage) 
        {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(errorMessageId);

            if (!jsonData[fieldId]) 
            {
                field.classList.add('error');
                errorElement.textContent = errorMessage;
                isValid = false;
            } 
            else 
            {
                field.classList.remove('error');
                errorElement.textContent = '';
            }
        }

        validateField('projeto', 'projeto-error', 'O campo "Projeto" é obrigatório.');
        validateField('serie', 'serie-error', 'O campo "Série" é obrigatório.');
        validateField('professor', 'professor-error', 'O campo "Professor" é obrigatório.');
        validateField('descricao', 'descricao-error', 'O campo "Descrição" é obrigatório.');
        validateField('dataInicio', 'dataInicio-error', 'O campo "Data Início" é obrigatório.');
        validateField('dataFim', 'dataFim-error', 'O campo "Data Fim" é obrigatório.');

        if (!isValid) 
        {
            document.getElementById('mensagem').textContent = 'Preencha todos os campos obrigatórios.';
            return;
        }

        console.log('Dados do formulário:', jsonData);

        fetch(`${baseUrl}/projetos`, {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('Status da resposta:', response.status);
                if (response.ok) 
                {
                    console.log('Resposta do servidor:', response);
                    document.getElementById('mensagem').textContent = 'Formulário enviado com sucesso!';
                    setTimeout(() => {
                        location.reload(); 
                    }, 5000);
                } 
                else 
                {
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