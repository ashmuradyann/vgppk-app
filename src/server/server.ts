const express = require('express')
const multer = require('multer')
// import ipcMain from 'electron'
const db = '../main/db'

// import db from "../main/db.ts";

const app = express()

const upload = multer({ dest: 'templates/' })

app.use(express.json())

app.post('/upload-template', upload.single('file'), (req, res) => {
  res.json({ message: 'Template uploaded', file: req.file })
})

app.get('/templates', (req, res) => {
  res.sendFile(__dirname + '/templates')
})

console.log(db.prepare('SELECT * FROM groups').all())

// ipcMain.handle('getGroups', () => {
//   return db.prepare('SELECT * FROM groups').all()
// })

// ipcMain.handle("getStudents", (event, groupId) => {
//     return db.prepare("SELECT * FROM students WHERE group_id = ?").all(groupId);
// });

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
