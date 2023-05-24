const express = require("express");
const app = express();
const emailValidator = require("deep-email-validator");

app.use(express.json());

async function isEmailValid(email) {
  return emailValidator.validate(email);
}

app.post("/register", async function (req, res, next) {
  const { email, password, number } = req.body;

  if (!email || !password || !number) {
    return res.status(400).send({
      message: "Field inputs missing.",
    });
  }

  if (number[0] != 0) {
    return res.status(400).send({
      message: "Phone number must start with zero",
    });
  }

  const { valid, reason, validators } = await isEmailValid(email);

  if (valid) return res.send({ message: "OK" });

  return res.status(400).send({
    message: "Please provide a valid email address.",
    reason: validators[reason].reason,
  });
});

app.listen(8080, () => {
  console.log(`Server running on 8080`);
});