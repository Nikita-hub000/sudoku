const { Router } = require("express");
const router = Router();
const db = require("../models/index");

router.post("/render", async (req, res) => {
  try {
    console.log(db);
    const { id } = req.body;
    let a = await db.users.findAll()
    console.log(a)
    return !!a ? res.status(200).json(a.filter(x => x.id !== id)) : res.status(404).json(res);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/getUserInfo", async (req, res) => {
    try {
      const { id } = req.body;
      let a = await db.users.findAll({where: {id}})
      return !!a ? res.status(200).json(a) : res.status(404).json(res);
    } catch (error) {
      res.status(404).json(error);
    }
  });




module.exports = router;
