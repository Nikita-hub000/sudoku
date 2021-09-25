const { Router } = require("express");
const router = Router();
const db = require("../models/index");
const { v4: uuid_v4 } = require("uuid");

router.post("/bd", async (req, res) => {
  try {
    console.log(db);
    const { id, numbers, trueVariant } = req.body;
    let a = await db.sudoku.create({
      id: id,
      trueVariant: trueVariant,
      numbers: numbers,
    });
    return a ? res.status(200).json("ok") : res.status(404).json(res);
  } catch (error) {
    res.status(404).json(error);
  }
});


router.post("/userId", async (req, res) => {
    try {
      console.log(db);
      const { email } = req.body;
      let a = await db.users.findAll({where: {email}})
      return res.json({1: a})
    } catch (error) {
      res.status(404).json(error);
    }
  });


  router.post("/sudokuId", async (req, res) => {
    try {
      console.log(db);
      const { userId } = req.body;
      await db.solved.removeColumn('solved', 'sudId')
      let a = await db.solved.findAll({where: {userId}})
  
      return res.json({1: a})
    } catch (error) {
      res.status(404).json(error);
    }
  });



router.post("/solve", async (req, res) => {
  try {
    console.log(db);
    const { id, userId, email, experience, sudokuCount } = req.body;
    let a = await db.solved.create({
      id: Math.random() * (10000 - 1) + 1,
      userId: userId,
      sudokuId: id,
    });
    let b =  await db.users.update(
        { experience: experience, sudokuCount: sudokuCount },
        { where: { email: email } }
      ).then( res => console.log(res))
      .catch( err => console.log('err' + err));
    return a && b ? res.status(200).json("ok") : res.status(404).json("err");
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
