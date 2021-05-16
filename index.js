const bodyParser = require("body-parser");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
const contactAddress = "robertpala77@gmail.com";
const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

app.get("/contact", function (req, res) {
  res.send("test");
});

app.post("/contact", function (req, res) {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <h5>${req.body.subject}</h5>
    <p>${req.body.message}</p>
  `;
  mailer.sendMail(
    {
      from: "Contact form <wojciechrudek@gmail.com>",
      to: [contactAddress],
      subject: req.body.subject || "[No subject]",
      html: output || "[No message]",
    },
    function (err, info) {
      if (err) return res.status(500).send(err);
      // res.json({ success: true });
      res.send("Email has been sent");
    }
  );
});
app.listen(port, () => console.log("serwer działa"));
