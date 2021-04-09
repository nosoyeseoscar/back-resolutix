//usamos dotnev para cargar configuraciones .env
require('dotenv').config()

//requerimos el codigo que hace la conexion
require('./mongo')

//middleware  
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

const express = require('express')
const cors = require('cors')//evita problemas de origenes CORS
const app = express()
//importamos el modelo para hacer uso del modelo mongoose
const Docto = require('./models/Docs')

app.use(express.json()) // habilitamos el parser de express para Json y poder enviar json al cliente.
app.use(cors())//habilitamos cualquier origen.
app.use('/images', express.static('images'))//servir estaticos (imagenes) desde express

/* let documentsTest = [
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
] */

/* const app = http.createServer((request, response)=>{
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.end('Hola mundo')
}) */

// ruta Home
app.get('/', (request, response) => {
  response.send('<h1>Hello World<h1>')
})

// ruta recuperar todos los documentos
app.get('/api/documents', (request, response, next) => {
  Docto.find()
  .then(results=>{
    response.json(results)
  }).catch(err=>{
    next(err)
   })
})

// ruta recuperar documento unico
app.get('/api/documents/:id', (request, response, next) => {
  const {id} = request.params
  Docto.findById(id).then( note => {
    if (note) {
      return response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err=>{
   next(err)
  })
  
})

// ruta para editar un documento.
app.put('/api/documents/:id', (request, response,next) => {
  const {id} = request.params
  const docto = request.body
  
  const newDoctoInfo = {
    numOf: docto.numOf,
    promovente: docto.promovente,
    tipo: docto.tipo
  }

  Docto.findByIdAndUpdate(id, newDoctoInfo, {new:true}).then( result => {
    response.json(result)
  }).catch( error => { 
    next(error)
  })
  
})

// ruta para borrar un documento.
app.delete('/api/documents/:id', (request, response,next) => {
  const {id} = request.params
  Docto.findByIdAndDelete(id).then( () => {
    response.status(204).end()
  }).catch( error => { 
    next(error)
  })
})

// ruta para crear un recurso en el servidor.
app.post('/api/documents', (request, response, next) => {
  const docto = request.body

  // en caso de que este vacio o sin algun campo dar error.
  if (!docto || !docto.promovente || !docto.numOf) {
    return response.status(400).json({
      error: 'Necesary content required'
    })
  }

  const newDocto = new Docto({
    numOf: docto.numOf,
    promovente: docto.promovente,
    tipo: docto.tipo
  })

  newDocto.save().then( savedDocto =>{
    response.status(201).json(savedDocto)
  }).catch(err=>{
    next(err)
   })

  /* const ids = documentsTest.map(doc => doc.id)
  const maxId = Math.max(...ids)

  const newDocto = {
    id: maxId + 1,
    numOf: docto.numOf,
    promovente: docto.promovente,
    tipo: docto.tipo
  } 

  documentsTest = [...documentsTest, newDocto]

  response.status(201).json(docto)*/
})

// ruta de error
app.use(handleErrors)

app.use(notFound)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
