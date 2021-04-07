//requerimos Schema y Model de mongoose
const {model, Schema} = require('mongoose')

//esquema de documentos
const documentosSchema = new Schema({
    numOf: String, //usamos constructor para tipos de datos
    promovente: String,
    tipo: String
})

//cambiamos el toJson para que el formato quede legible para el front
documentosSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id
        //mala practica usar delete, pero aqui no muta info
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//hacemos el modelo documento en singular
const Docto = model('Docto', documentosSchema)

module.exports = Docto