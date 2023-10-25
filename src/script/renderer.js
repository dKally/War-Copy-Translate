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
        let objetoJson = JSON.parse(data)
        for(let i = 0;i < objetoJson.length; i++){
            let listaDeTexto = document.createElement('li')
            let conteudoNovo = document.createTextNode(objetoJson[i])
            listaDeTexto.appendChild(conteudoNovo)
            
            let btn = document.createElement('button')
            
            btn.textContent = 'Copiar'

            btn.addEventListener('click', function() {
            console.log('Botão clicado para o item ' + i);

            async function copiarTexto(){
              await navigator.clipboard.writeText(objetoJson[i])
              btn.innerText = 'Copiado'
              setTimeout(() => {
                btn.innerText = 'Copiar'
              }, 3000);
            }
            copiarTexto()
        });
          
            let divAtual = document.getElementById("textos");
            divAtual.appendChild(listaDeTexto);    
            divAtual.appendChild(btn);    
        }
    })
}
atualizarLista()

// document.getElementById('atualizar').addEventListener('click',()=>{
//     atualizarLista()
// })


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