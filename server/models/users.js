const Sequalize = require('sequelize')

module.exports = function(seq){
    return seq.define('users', {
        id: {
            type: Sequalize.INTEGER,
            autoincrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequalize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequalize.STRING,
            allowNull: false,
        },
        experience: {
            type: Sequalize.INTEGER,
            allowNull: false,
        },
        sudokuCount: {
            type: Sequalize.INTEGER,
            allowNull: false,
        },
        email: {
            type: Sequalize.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
        tableName: 'users'
    })
}