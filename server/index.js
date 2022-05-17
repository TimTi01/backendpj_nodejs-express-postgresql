require('dotenv').config() //dotenv нужен, чтобы сервер мог считывать файл .env
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')


const PORT = process.env.PORT||5000

const app = express()
app.use(cors()) // middleware для взаимодействия между локальным клиентом и сервером
app.use(express.json()) // для парсинга JSON формата
app.use('/api', router)

// ВАЖНО! middleware, который работает с ошибками должен регестрироваться в конце 
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate() // функция подключения к БД
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()