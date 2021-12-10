//Импортируем созданные нами модели пользователя и роли
const User = require('./models/User')
const Role = require('./models/Role')

const bcrypt = require('bcryptjs'); //Подключаем модуль хеширования паролей
const { validationResult } = require('express-validator') //Из модуля валидатора экспортируем функцию, которая будет возвращать ошибки при валидации
const jwt = require('jsonwebtoken'); //Импортируем модуль jwt токен
const {secret} = require("./config") //Импортируем секретный ключ


//Функция для генерации токена, которая принимает айди и роли пользователя, чтобы спрятать эту информацию
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} ) //Возвращает токен. Первый параметр - информация, которую мы хотим спрятать, 
    //второй параметр - секретный ключ, третий параметр - время действия токена
}


//Здесь описываем все функции по взаимодействию с пользователем
class authController {
	async registration(req, res) { //У функций 2 параметра: запрос и ответ
		try {
            console.log(req.body)

			const errors = validationResult(req) 
            if (!errors.isEmpty()) { //Если массив ошибок не пустой, то вывести ошибку, и закончить 
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }

			const {username, password} = req.body; //Берём логин и пароль из тела запроса
			const candidate = await User.findOne({username}) //Кандидат, которого будем проверять на наличие в БД.
			if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"}) //Результат проверки
            }
            //Если условие не вызвалось, идём дальше
            const hashPassword = bcrypt.hashSync(password, 7); //Захешированный пароль. Первый параметр - пароль, второй - степень хеширования
            const userRole = await Role.findOne({value: "USER"}) //Получаем с БД роль (т.к. ранее мы сохранили в БД роли)
            const user = new User({username, password: hashPassword, roles: [userRole.value]}) //В БД вводим захешированный пароль, имя и роль
            await user.save() //Сохраняем пользователя
            return res.json({message: "Пользователь успешно зарегистрирован"}) //Вызываем ответ пользователю
		} catch(e) {
			//Вывод ошибки (400 - ошибки) и сообщение
			console.log(e) 
            res.status(400).json({message: 'Registration error'}) 
		}
	}

	async login(req, res) {
		try {
			const {username, password} = req.body //Получаем из теля запроса логин и пароль
            const user = await User.findOne({username}) //Делаем запрос в БД на поиск данного пользователя
            if (!user) { //Если БД ничего не вернула - ошибка
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }

            //Если же пользователя нашли, сравниваем пароль, хранящийся в БД с паролем, который пришёл в теле запроса
            const validPassword = bcrypt.compareSync(password, user.password) //Функция сравнения захешированного и обычного пароля
            //Первым параметром указываем обычный пароль, вторым захешированный пароль в БД
            if (!validPassword) { //Если совпадение не получено, то выводим ошибку
                return res.status(400).json({message: `Введен неверный пароль`})
            }

            //Вызов функции генерирации токена
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token}) //Возвращаем токен ответом
		} catch(e) {
			console.log(e)
            res.status(400).json({message: 'Login error'})
		}
	}

	async getUsers(req, res) {
		try {
			res.json('server works')
		} catch(e) {
			console.log(e)
		}
	}
}

module.exports = new authController() //Экспортируем объект класса