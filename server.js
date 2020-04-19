const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const logger = require('morgan');
const nodemailer = require('nodemailer');
const NewsAPI = require('newsapi');
const fs = require('fs');
require("dotenv").config();


const app = express();
const PORT = 3000;

//middleware
app.use("/", express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(logger("short"));


//routes to HTML pages

//route to contact html
app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/contact.html");
});

//route for news html
app.get("/news", (req, res) => {
  res.sendFile(__dirname + "/news.html");
});

//route for contact form
app.post("/create_email", (req, res) => {
  res.status(204).send();
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const message = req.body.message;
  res.end();
  sendEmail(fname, lname, email, message);
});

//email section start
function sendEmail(fname, lname, email, message) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptionsA = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    subject: "CONTACT",
    html: fname + " " + lname + "<br/> " + email + "<br>" + message
  };

  const mailOptionsB = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Thank you " + fname + " " + lname + " " + "for contacting me",
    html:
      "<a style='color: black;'>Dear </a>" +
      fname +
      ",<p>Thank you for contacting me! I really appreciate you taking the time to look at my website and to reach out to me. This is just an automated email to let you know that I got your message, so I will get back to you in person as soon as I can. </p><p>Peace!</p><p>Cinque Mason</p> "
  };

  transporter.sendMail(mailOptionsA, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  transporter.sendMail(mailOptionsB, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
//email section finish

//beginning news api

const newsapi = new NewsAPI('7e7ac84a1acb4258bd8d9805911cc8a6');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
newsapi.v2.topHeadlines({
  
  // q: 'smoking',
  sources: 'bbc-news',
  language: 'en'
 
}).then(response => {
  console.log(response);
  var data = JSON.stringify(response); 
  fs.writeFile('./public/newsData.txt', data, (err) => {
    if(err) throw err;
  });
  
});
//ending news api

//port listening
app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}`);
});