const { ipcRenderer } = require('electron');

document.getElementById('text-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = document.getElementById('texto').value;
    ipcRenderer.send('salvar-texto', texto);
});

ipcRenderer.on('texto-salvo', (event, mensagem) => {
    document.getElementById('texto-salvo').textContent = mensagem;
});

document.getElementById('traduzir').addEventListener('click', () => {
    ipcRenderer.send('traduzir-texto');
});

ipcRenderer.on('texto-traduzido', (event, textos) => {
    // Implemente aqui a lógica de exibição dos textos traduzidos no HTML
});