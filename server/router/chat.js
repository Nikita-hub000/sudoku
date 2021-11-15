const { Router } = require("express");
const router = Router();
const db = require("../models/index");

router.post("/render", async (req, res) => {
  try {
    console.log(db);
    const { fromId, toId } = req.body;
    let a = await db.chat.findAll({where: {fromId, toId}})
    let b = await db.chat.findAll({where: {fromId: toId, toId: fromId}})
    let c = [...a, ...b]
    return !!a ? res.status(200).json(c) : res.status(404).json(res);
  } catch (error) {
    res.status(404).json(error);
  }
});


router.post("/add", async (req, res) => {
    try {
      console.log(db);
      const { fromId, toId, text, date } = req.body;
      let a = await db.chat.create({
          id: Math.floor(Math.random() * (100_000 - 1)) + 1,
          fromId,
          toId, 
          text, 
          date
      })
      return a ? res.status(200).json("ok") : res.status(404).json(res);
    } catch (error) {
      res.status(404).json(error);
    }
  });

router.put("/delete", async (req, res) => {
    try {
      console.log(db);
      const { id } = req.body;
      let a = await db.chat.destroy({where: {id}})
      return a ? res.status(200).json("ok") : res.status(404).json(res);
    } catch (error) {
      res.status(404).json(error);
    }
  });

router.put("/update", async (req, res) => {
    try {
      console.log(db);
      const { id, text } = req.body;
      let a = await db.chat.update({text}, {where: {id}})
      return a ? res.status(200).json("ok") : res.status(404).json(res);
    } catch (error) {
      res.status(404).json(error);
    }
  });


module.exports = router;
