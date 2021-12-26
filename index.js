const express = require('express') //Импортируем express (для создания приложения)
const path = require('path')
const mongoose = require('mongoose') //Импорт mongoose (для работой с базой данных Mongo)
const authRouter  = require('./authRouter')
const PORT = process.env.PORT || 5000 //Создаём константу для хранения значения порта. Сначала получаем из системных переменных,
//если она пустая, по умолчанию даём порт 5000

const app = express() //Создаём само приложение

app.set('view engine', 'ejs')

app.use('/public', express.static('public'))
app.use(express.json()) //Чтобы парсить json, который будет в запросах
app.use("/auth", authRouter) //Чтобы функция слушала этот роутер
app.use("/", (req, res) => {
    res.render('Main')
}) //Чтобы функция слушала этот роутер

const start = async () => { //ф-ия запуска сервера (async т.к. операции с БД всегда асинхронные)
	try { //try catch для отлавливание ошибок при вызове сервера
		await mongoose.connect(`mongodb+srv://LuRiD:admin@cluster0.iiyrr.mongodb.net/auth_roles?retryWrites=true&w=majority`) // Подключаемся к БД
		app.listen(PORT, () => console.log(`server started on port ${PORT}`)) //Запуск сервера (app прослушивает порт PORT).
	} catch (e) {
		console.log(e) //Вывод ошибки
	}
}

start() //Вызов функции
