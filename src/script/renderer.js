const { ipcRenderer } = require('electron');
const path = require('path')
const fs = require('fs')

const textosJSON = path.join(__dirname, '..', 'textos.json')

function atualizarLista(){
    fs.readFile(textosJSON, 'utf8', (error, data) => {
        if (error) {
          console.error(error)
          return
        }
        let jsonObject = JSON.parse(data)
        for(let i = 0;i < jsonObject.length; i++){
            let listaDeTexto = document.createElement('li')
            let conteudoNovo = document.createTextNode(jsonObject[i])
            listaDeTexto.appendChild(conteudoNovo)
          
            let divAtual = document.getElementById("textos");
            divAtual.appendChild(listaDeTexto);    }
    })
}
atualizarLista()

document.getElementById('atualizar').addEventListener('click',()=>{
    atualizarLista()
})


document.getElementById('text-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = document.getElementById('texto').value;
    ipcRenderer.send('salvar-texto', texto);
});

ipcRenderer.on('texto-salvo', (event, mensagem) => {
    document.getElementById('texto-salvo').textContent = mensagem
    setTimeout(() => {
        document.getElementById('texto-salvo').textContent = ''
    }, 5000);
});

document.getElementById('traduzir').addEventListener('click', () => {
    ipcRenderer.send('traduzir-texto');
});

ipcRenderer.on('texto-traduzido', (event, textos) => {


});