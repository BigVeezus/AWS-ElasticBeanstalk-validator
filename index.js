const express = require("express");
const app = express();
const emailValidator = require("deep-email-validator");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8080;
app.use(express.json());

async function isEmailValid(email) {
  return emailValidator.validate(email);
}

app.get("/", (req, res) => {
  res.send("THIS IS HOME PAGE DEPLOYED TO AWS BEANSTALK");
});

app.post("/register", async function (req, res, next) {
  const { email, password, number } = req.body;

  if (!email || !password || !number) {
    return res.status(400).send({
      message: "Field inputs missing.",
    });
  }

  var pattern = new RegExp(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*?()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*?()_+]{5,19}$/
  );
  if (!pattern.test(password)) {
    return res.status(400).send({
      message: "Password must contain 1 number and 1 special character",
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

app.listen(PORT, () => {
  console.log(`Server running on 8080`);
});
