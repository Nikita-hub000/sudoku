const Sequalize = require('sequelize')
module.exports = function(seq){
    return seq.define('sud', {
        id: {
            type: Sequalize.INTEGER,
            autoincrement: true,
            primaryKey: true,
            allowNull: false
        },
        numbers: {
            type: Sequalize.JSON,
            allowNull: false
        },
        trueVariant:{
            type: Sequalize.JSON,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'sud'
    })
}