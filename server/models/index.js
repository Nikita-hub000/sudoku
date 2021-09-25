const Sequalize = require("sequelize")

const sequalize = new Sequalize('sudoku', "root", "Bmstu1830", {
    dialect: "mysql",
    host: "localhost",
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000
      },
})

const Users = require('./users')(sequalize)
const Sudoku = require('./sudoku')(sequalize)
const Solved = require('./solved')(sequalize)
Users.hasMany(Solved)
Sudoku.hasMany(Solved)

module.exports ={
    sequalize, 
    users: Users,
    sudoku: Sudoku,
    solved: Solved
}
