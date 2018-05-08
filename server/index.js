var express = require("express");
var app = express();
const { Client } = require('pg');
var express = require('express')(),
    mailer = require('express-mailer');
var PORT = process.env.PORT || 5000; // default port 3000
const bodyParser = require("body-parser");
// bcrypt
// cookie-session

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
});

app.set("view engine", "jsx");
app.engine('jsx', require('express-react-views').createEngine());
app.use(bodyParser.urlencoded({extended: true}));

var myVar = setInterval(checkInCheck, 5000);

var activeusers = {
  'xxjeffxx': {count: 0
  }
};


mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'nudge.project.head@gmail.com',
    pass: 'lighthouse01'
  }
});

// For each user connected to the app, keeps counter.
// Once counter reaches 10, it sends an automated email to the user's contact.
function checkInCheck() {
  var emails = [];
  var contactList = '';
  for (var user in activeusers){
    activeusers[user].count += 1;
    console.log("test up", user, activeusers[user].count);
    if (activeusers[user].count > 10){




 client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(result.rows);
    client.query("SELECT contact_id FROM contacts WHERE owner_id = (" + result.rows[0].id + ")", (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }

      contactList += result.rows[0].contact_id;
      for (var i = 1; i < result.rows.length; i++){
        contactList += ", " + (result.rows[i].contact_id);
      }

      client.query("SELECT email FROM users WHERE id IN (" + contactList + ")", (err, result) => {
        if (err) {
          return console.error("error running query", err);
        }
        for (var i = 0; i < result.rows.length; i++){
          emails.push(result.rows[i].email);
        }








      // for (var i = 0; i < emails.length; i++){
      //  sendEmail(emails[i]);
      // }
      });
      });
     });
 console.log('EMAIL SENT!');
 activeusers[user].count = 0;
    }
  };
}

//NOT TESTED
function addContact(user, email, name){
var owner;
var contact;
  client.query("SELECT EXISTS (SELECT 1 FROM user WHERE email LIKE '%"+ email+"%'", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    if (result.rows[0] == 'f'){
      client.query("INSERT INTO users (email) VALUES (" + email + ")", (err, result) => {
        if (err) {
          return console.error("error inserting query", err);
        }
      });
    }
  });

  client.query("SELECT id FROM users WHERE email LIKE '%" + email + "%'", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    contact = result.rows[0].id;
    client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }
      owner = result.rows[0].id;
      client.query("INSERT INTO contacts (owner_id, contact_id, nickname) VALUES (" + owner + ", " + contact + ", " + name + ")", (err, result) => {
        if (err) {
          return console.error("error inserting query", err);
        }
      });
    });
  });
}

function temp1(){

}

function sendEmail(email){
  app.mailer.send('email', {
    to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: 'Test Email', // REQUIRED.
    otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      console.log('There was an error sending the email');
      return;
    }
    console.log('Email Sent');
  });
};

app.get("/ping", (req, res) => {
  activeusers['Brianator'] = {count: 0};
  res.send("{message: SERVER RECEIVED RESPONSE!}");
});

// make "/users/:id"
// app.get("/:id", (req, res) => {
//   activeusers[req.params.id].count = 0;
//   res.redirect("http://localhost:5000");
// });

// app.get("/login", (req, res) => {
//   activeusers[req.params.id] = {count : 0}
//   res.redirect("http://localhost:5000");
// });

// app.get("/logout", (req, res) => {
//   delete activeusers[req.params.id];
//   res.redirect("http://localhost:5000");
// });

// app.post("/update/:id", (req, res) => {
//   addContact(req.params.id, req.body.email, req.body.name);
//   res.redirect("http://localhost:8080");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});