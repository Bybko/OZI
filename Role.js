const {Schema, model} = require('mongoose')

const Role = new Schema({ //Схема для роли
	//Одно поле всего - значение (разные роли, по дефолту - юзер)
    value: {type: String, unique: true, default: "USER"},
})

module.exports = model('Role', Role)