const express = require('express')
const cors = require('cors')//evita problemas de origenes CORS
const app = express()

app.use(express.json()) // habilitamos el parser de express para Json y poder enviar json al cliente.
app.use(cors())//habilitamos cualquier origen.

let documentsTest = [
  {
    id: 1,
    numOf: '03-BS-001',
    promovente: 'Fulanito de Tal',
    tipo: 'Requerimiento'
  },
  {
    id: 2,
    numOf: '03-BS-002',
    promovente: 'Ricardito',
    tipo: 'Resolutivo'
  },
  {
    id: 3,
    numOf: 'IA.246/21',
    promovente: 'Fulanito de Tal',
    tipo: 'Requerimiento'
  }
]

/* const app = http.createServer((request, response)=>{
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.end('Hola mundo')
}) */

// ruta Home
app.get('/', (request, response) => {
  response.send('<h1>Hello World<h1>')
})

// ruta recuperar todos los documentos
app.get('/api/documents', (request, response) => {
  response.json(documentsTest)
})

// ruta recuperar documento unico
app.get('/api/documents/:id', (request, response) => {
  const id = Number(request.params.id)
  const docto = documentsTest.find(doc => doc.id === id)
  response.json(docto)
})

// ruta para borrar un documento.
app.delete('/api/documents/:id', (request, response) => {
  const id = Number(request.params.id)
  const doctos = documentsTest.filter(doc => doc.id !== id)
  response.json(doctos)
  response.status(204).end()
})

// ruta para crear un recurso en el servidor.
app.post('/api/documents', (request, response) => {
  const docto = request.body

  // en caso de que este vacio o sin algun campo dar error.
  if (!docto || !docto.promovente || !docto.numOf) {
    return response.status(400).json({
      error: 'Necesary content required'
    })
  }

  const ids = documentsTest.map(doc => doc.id)
  const maxId = Math.max(...ids)

  const newDocto = {
    id: maxId + 1,
    numOf: docto.numOf,
    promovente: docto.promovente,
    tipo: docto.tipo
  }

  documentsTest = [...documentsTest, newDocto]

  response.status(201).json(newDocto)
})

// ruta de error 404
app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
