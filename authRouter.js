const Router = require('express') 
const router = new Router() //Создаём объект роутера, чтобы он мог прослушивать запросы
const controller = require('./authController')
const {check} = require("express-validator") //Экспортируем валидатор-функцию check из данного модуля (нужна для проверки). Эта функция передаётся вторым параметром,
//их можно передать несколько, передаются как массив

const bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Запрос и вызов соответстующей запросу функции:
router.get('/registration', controller.getRegistration)
router.post('/registration', urlencodedParser, [                                  //Запрос на регистрацию
	//Валидируем на кол-во символов (чтобы логи и пароль не были пустыми, а также вводит ограничение на длину пароля)
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10})
], controller.registration)
router.get('/login', controller.getLogin)
router.post('/login', urlencodedParser, controller.login) //Запрос на логин
router.get('/users', controller.getUsers) //Запрос на различные доступы (разные уровни доступа)\

module.exports = router //Экспортируем этот объект в другие модули
