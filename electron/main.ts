import { app, BrowserWindow } from "electron"

let mainWindow: BrowserWindow | null = null

function createWindow(): void {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true
    })

    mainWindow.loadURL("http://localhost:5173")
}

app.whenReady().then(createWindow)