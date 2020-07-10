#!/usr/bin/env node

const { app, BrowserWindow, Menu, Tray, Dialog } = require('electron')

const express = require('express')
const server = express()

const path = require('path')

const log = console.log


//
// express
//

const views = __dirname + '/app/'

server.use(express.static(views))

server.get('/', (req, res) => {
  res.sendFile(views + 'app.html')
})

// err
server.use((err, req, res, next) => {
  if (err) {
    throw err
  }
  res.sendFile(views + 'app.html')
})

// create random port
const port = server.listen(0, () => {
  log('[kraft] listening on port:', port.address().port);
})

//
// electron
//

let win, contextMenu

createWindow = () => {
  win = new BrowserWindow({
    title: 'Kraft',
    icon: path.join(__dirname, 'assets/icon.png'),
    backgroundColor: '#262626',
    width: 1280,
    height: 700,
    frame: true,
    webgl: true,
    show: true,
    webPreferences: {
      javascript: true,
      plugins: true,
      zoomFactor: 1,
      nodeIntegration: false
    }
  })

  win.maximize()
  win.loadURL('http://127.0.0.1:' + port.address().port)

  // custom menu bar
  const template = [
    {
      label: 'Kraft',
      submenu: [
        { role: 'minimize' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [{
        label: 'About',
          click() {
            require('electron').dialog.showMessageBox({
              type: 'info',
              buttons: ['Close'],
              defaultId: 2,
              title: 'About',
              message: 'Kraft Community (build v4.6.22)',
              detail: 'A professional tool for crafting the web UI, prototyping and ready for production mockups.\n\n(https://github.com/loouislow81/kraft.ui)'
            })
          }
        },
        {
          label: 'Learn More',
          click() {
            require('electron').shell.openExternal('https://github.com/loouislow81/kraft.ui/wiki')
          }
        }
      ]
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // tray menu

  win.on('minimize', (event) => {
    event.preventDefault()
    win.hide()
  })

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      win.hide()
    }
    return false
  })

  tray = new Tray('assets/applet_icon.png')
  let contextMenu = Menu.buildFromTemplate([{
      label: 'Show App',
      click: () => {
        win.show()
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Kraft')
  tray.setContextMenu(contextMenu)

}

app.on('ready', createWindow)

// closed properly if requested by the OS or user
app.on('before-quit', () => {
  isQuiting = true
})

// quit when all windows are closed
app.on('window-all-closed', () => {
  if (app.listeners('window-all-closed').length === 1 && !option.interactive) {
    app.quit()
  }
})

app.on('activate', () => {
  // dock icon is clicked and there are no other windows open
  if (win === null) {
    createWindow()
  }
})

