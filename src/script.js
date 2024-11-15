document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-projeto').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const jsonData = {};

        for (const [key, value] of formData.entries()) {
            jsonData[key] = value;
        }

        console.log('Dados do formulário:', jsonData);

        fetch('http://127.0.0.1:3333/projetos', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log('Status da resposta:', response.status);
            if (response.ok) {
                console.log('Resposta do servidor:', response);
                document.getElementById('mensagem').textContent = 'Formulário enviado com sucesso!';
                
                setTimeout(() => {
                    location.reload();
                }, 5000);
            } else {
                console.error('Erro ao enviar o formulário:', response.statusText);
                document.getElementById('mensagem').textContent = 'Erro ao enviar o formulário. Por favor, tente novamente.';
            }
        }).catch(err => {
            console.error('Erro ao enviar a requisição:', err);
            document.getElementById('mensagem').textContent = 'Erro ao enviar o formulário. Por favor, tente novamente.';
        });
    });
});
