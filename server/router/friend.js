const { Router } = require("express");
const router = Router();
const db = require("../models/index");


router.post("/renderAll", async (req, res) => {
  try {
    console.log(db);
    let a = await db.friend.findAll()
    console.log(a)
    return !!a ? res.status(200).json(a) : res.status(404).json(res);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/render", async (req, res) => {
  try {
    console.log(db);
    const { requestUser } = req.body;
    let a = await db.friend.findAll({where: {requestUser}})
    console.log(a)
    return !!a ? res.status(200).json(a) : res.status(404).json(res);
  } catch (error) {
    res.status(404).json(error);
  }
});


router.post("/renderResponse", async (req, res) => {
    try {
      console.log(db);
      const { responseUser } = req.body;
      let a = await db.friend.findAll({where: {responseUser}})
      console.log(a)
      return !!a ? res.status(200).json(a) : res.status(404).json(res);
    } catch (error) {
      res.status(404).json(error);
    }
  });


router.post("/add", async (req, res) => {
    try {
      console.log(db);
      const { requestUser, responseUser, date } = req.body;
      let a = await db.friend.create({
          id: Math.floor(Math.random() * (100_000 - 1)) + 1,
          requestUser,
          responseUser, 
          isFriend: false, 
          date
      })
      return a ? res.status(200).json(a) : res.status(404).json(res);
    } catch (error) {
      res.status(404).json(error);
    }
  });

router.post("/approve", async (req, res) => {
    try {
      console.log(db);
      const { requestUser, responseUser, isFriend } = req.body;
      let a = await db.friend.update(
        { isFriend },
        { where: { requestUser, responseUser } })
      return a ? res.status(200).json(a) : res.status(404).json(res);
    } catch (error) {
      res.status(404).json(error);
    }
  });

router.put("/delete", async (req, res) => {
    try {
      console.log(db);
      const { requestUser, responseUser } = req.body;
      let a = await db.friend.destroy({where: {requestUser, responseUser}})
      return a ? res.status(200).json("ok") : res.status(404).json(res);
    } catch (error) {
      res.status(404).json(error);
    }
  });




module.exports = router;
