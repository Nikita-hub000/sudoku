const { Router } = require("express");
const router = Router();
const nodemailer = require("nodemailer");
const db = require("../models/index");
const { v4: uuid_v4 } = require("uuid");

router.post("/registration", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    let a = await db.users.create({
      id: uuid_v4(),
      name: name,
      email: email,
      password: password,
      sudokuCount: 0,
      experience: 0,
    });
    return a ? res.status(200).json("ok") : res.status(404).json("err");
  } catch (error) {
    res.status(404).json(error)
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    let a = await db.users
      .findOne({ where: { email, password, name } })
      .then((res) => res !== null);

    return a ? res.status(200).json("ok") : res.status(404).json("err");
  } catch (error) {
    console.log(error);
  }
});

router.post("/restore", async (req, res) => {
  try {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: "nodemailer01@mail.ru",
        pass: "fdn75u7L44pTgpbeZWaY",
      },
    });

    let result = await transporter.sendMail({
      from: '"Смена пароля" <nodemailer01@mail.ru>',
      to: email,
      subject: "Смена пароля",
      text: `Для смены пароля перейдите по ссылке http://localhost:3000/password/${uuid_v4()}`,
    });
    console.log(result);
    return res.status(200).json("ok");
  } catch (error) {
    res.status(404).json("err");
  }
});

router.post("/newPas", async (req, res) => {
  try {
    const { old, newPas, email } = req.body;
    let password = old
    let a = await db.users
      .findOne({ where: { password, email } })
      .then((res) => res !== null);
    if (a) {
      await db.users.update(
        { password: newPas },
        { where: { email: email } }
      ).then( res => console.log(res))
      .catch( err => console.log('err' + err))
      return res.status(200).json("ok")
    }
    else{
      return res.status(404).json("err");
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
