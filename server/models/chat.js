const Sequalize = require('sequelize')
module.exports = function(seq){
    return seq.define('chat', {
        id: {
            type: Sequalize.INTEGER,
            autoincrement: true,
            primaryKey: true,
            allowNull: false
        },
        fromId: {
            type: Sequalize.STRING,
            allowNull: false
        },
        toId:{
            type: Sequalize.STRING,
            allowNull: false
        },
        text:{
            type: Sequalize.STRING,
            allowNull: false
        },
        date:{
            type: Sequalize.BIGINT,
            allowNull: false
        },
    }, {
        timestamps: false,
        tableName: 'chat'
    })
}