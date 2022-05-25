const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, // первый объект - центральная часть jwt-токена
        process.env.SECRET_KEY, // второй параметр - секретный ключ
        {expiresIn: '24h'} // 3 параметр - опции. Одна из опции, это время жизни токена
    )
}

class UserController {
    async registration(req, res, next) {
        // Передача email, пароля и роли. Роль требуется для отдельного создания пользователей и админов 
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password!'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5) // хеширование пароля при помощи функции hash. В данном примере хешируем 5 раз
        const user = await User.create({email, role, password: hashPassword}) // создание пользователя
        const basket = await Basket.create({userId: user.id}) // создание корзины пользователя
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}}) // Проверяем, есть ли пользователь с таким email в БД
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }

        let comparePassword = bcrypt.compareSync(password, user.password) // при помощи compareSync сравниваем password, который ввёл пользователь и password из БД(user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль!'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        // const {id} = req.query //получение параметра строки запроса(query параметры в URL)
        // if (!id) {
        //     return next(ApiError.badRequest('Не задан ID'))
        // }
        // res.json(id)
    }
}

module.exports = new UserController()