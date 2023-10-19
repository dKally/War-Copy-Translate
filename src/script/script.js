const path = require('path')
const os = require('os')
const fs = require('fs')


const copyJSON = path.join(os.homedir(), 'Documentos', 'War Copy Translate.JSON')
const copyJSON1 = path.join(__dirname, 'teste.JSON')




const textInput = document.querySelector('.text-input')
const btnText = document.querySelector('.send-text')

btnText.addEventListener('click', ()=>{
    let text = 
`
{
    "text": "${textInput.value}"
}
`

    fs.writeFile(copyJSON1, text, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing to the file: ${err}`);
        } else {
          console.log('File has been written successfully.');
        }
      });
})

