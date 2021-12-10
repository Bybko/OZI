const {Schema, model} = require('mongoose') //Берём несколько полей из БД (Схема и модель)

const User = new Schema({ //Создаём схему (то, как пользователь будет храниться в БД)
	//Поля для пользователя и его параметры (тип данных, уникальность, обязательность)
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	roles: [{type: String, ref: 'Role'}]
})

module.exports = model('User', User) //Экспорт модели