const Sequalize = require('sequelize')
module.exports = function(seq){
    return seq.define('friend', {
        id: {
            type: Sequalize.INTEGER,
            autoincrement: true,
            primaryKey: true,
            allowNull: false
        },
        requestUser: {
            type: Sequalize.STRING,
            allowNull: false
        },
        responseUser:{
            type: Sequalize.STRING,
            allowNull: false
        },
        isFriend:{
            type: Sequalize.BOOLEAN,
            allowNull: false
        },
        date:{
            type: Sequalize.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
        tableName: 'friend'
    })
}