const {app, BrowserWindow, ipcMain, Menu, globalShortcut, clipboard} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')

let win

const isDev = process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "development"? true:false

app.setName("Translate APP")

let capturedClipboardText

const textosJSON = path.join(os.homedir(), 'Documentos', 'textos.json')


function createWindow(){
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: path.join(__dirname, '/src' ,'icon.png'),
        show: false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    win.loadFile('./src/index.html')
    if(isDev){
        win.webContents.openDevTools()
    }

    win.once('ready-to-show', ()=>{
        win.show()
    })

    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu)

    globalShortcut.register('Shift+I', () => {
        win.webContents.openDevTools()
    })

    globalShortcut.register('CommandOrControl+Shift+C', () => {
        try {
            // Acessa diretamente a área de transferência usando clipboard
            capturedClipboardText = clipboard.readText();
            console.log('Texto da área de transferência capturado:', capturedClipboardText);

            // Agora você pode salvar 'capturedClipboardText' no JSON e notificar a janela renderer, se necessário

            fs.readFile(textosJSON, 'utf-8', (err, data) => {
                if (!err) {
                    let textos = JSON.parse(data);
                    textos.push(capturedClipboardText);
                    fs.writeFile(textosJSON, JSON.stringify(textos), (err) => {
                        if (!err) {
                            console.log('Copiado')
                        } else {
                            console.log('Deu erro')
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Erro ao capturar o texto da área de transferência:', error);
        }
    });
}

app.whenReady().then(()=>{
    createWindow()
})

app.on('window-all-closed', ()=>{
    console.log("Todas as janelas foram fechadas!")
    app.quit()
})

app.on('activate', ()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow()
    }
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})
  
app.on('will-quit', function () {
    globalShortcut.unregisterAll();
})

const menuTemplate = [

]

ipcMain.on('salvar-texto', (event, texto) => {
    fs.readFile(textosJSON, 'utf-8', (err, data) => {
        let textos = [];
        if (!err) {
            textos = JSON.parse(data);
        }
        textos.push(texto);
        fs.writeFile(textosJSON, JSON.stringify(textos), (err) => {
            if (!err) {
                event.sender.send('texto-salvo', 'Texto salvo com sucesso.');
            } else {
                event.sender.send('texto-salvo', 'Erro ao salvar o texto.');
            }
        });
    });
});
