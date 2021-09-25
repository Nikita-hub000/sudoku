const Sequalize = require('sequelize')
module.exports = function(seq){
    return seq.define('sud', {
        id:{
            type: Sequalize.INTEGER,
            autoincrement: true,
            primaryKey: true,
            allowNull: false
        },
        userId:{
            type: Sequalize.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // 'fathers' refers to table name
                key: 'id', // 'id' refers to column name in fathers table
             }
        },
        sudokuId:{
            type: Sequalize.INTEGER,
            allowNull: false,
            references: {
                model: 'sudoku', // 'fathers' refers to table name
                key: 'id', // 'id' refers to column name in fathers table
             }
        },
    }, {
        timestamps: false,
        tableName: 'solved'
    })
}

