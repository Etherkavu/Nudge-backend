var express = require("express");
var app = express();
const https = require('https');
const { Client } = require('pg');
var express = require('express')(),
    mailer = require('express-mailer');
var PORT = process.env.PORT || 5000; // default port 5000
const bodyParser = require("body-parser");

//Pulls database_url from heroku, as their credentials change randomly we need to use their system.
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

//opens connection to database, gives error if issue.
client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
});

// app.set("view engine", "jsx");
// app.engine('jsx', require('express-react-views').createEngine());

// Required to let express do POST requests with bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

console.log("--------------------SERVER ACTIVE----------------------");

var activeusers = {
  'moo@moo.moo': {count: 10
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
// will increment counter based on myVar
var myVar = setInterval(checkInCheck, 300000);
function checkInCheck() {
  var emails = [];
  var contactList = '';
  for (var user in activeusers){
    activeusers[user].count += 1;
    console.log("test up", user, activeusers[user].count);
    if (activeusers[user].count > 10){

      //Handles the counter hitting 10,
      //will query database to pull their contacts emails
      client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
        if (err) {
          return console.error("error running query", err);
        }
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

            for (var i = 0; i < emails.length; i++){
              sendEmail(emails[i], user);
            }
          });
        });
      });
      activeusers[user].count = 0;
    }
  };
}

//adds contact to contacts tables, containing idetifier ID's to match it to its owner and its own email.
function addContact(user, add, name){
var owner;
var contact;
  client.query("SELECT EXISTS (SELECT 1 FROM users WHERE email LIKE '%"+ add +"%')", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    if (result.rows[0].exists == false){
      client.query("INSERT INTO users (email) VALUES ('" + add + "')", (err, result) => {
        if (err) {
          return console.error("error inserting query", err);
        }
      });
    }
    client.query("SELECT id FROM users WHERE email LIKE '%" + add + "%'", (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }
      contact = result.rows[0].id;
      client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
        if (err) {
          return console.error("error running query", err);
        }
        owner = result.rows[0].id;
        client.query("INSERT INTO contacts (owner_id, contact_id, nickname) VALUES (" + owner + ", " + contact + ", '" + name + "')", (err, result) => {
          if (err) {
            return console.error("error inserting query", err);
          }
        });
      });
    });
  });
}


function sendEmail(email, user){
  app.mailer.send('email', {
    to: email,
    subject: 'Notice of inactivity',
    locals: {
      title: "Notice,",
      message: "" + user + "has has no activity, please check in on them"
    }
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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.get("/ping", (req, res, next) => {
  console.log("Hey look we made it here");
  activeusers['moo@moo.moo'] = {count: 0};
  res.sendStatus(200);
});

app.get("/ping/:id", (req, res, next) => {
  client.query("SELECT email FROM users WHERE id = "+ req.params.id, (err, result) => {
    if (err) {
      return console.error("error inserting query", err);
    }
    activeusers[result.rows[0].email] = {count: 0};
    res.sendStatus(200);
  });
});

app.post("/login", (req, res, next) => {
  var id = 0;
  https.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+req.body.firstParam, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var info = JSON.parse(data);
      console.log(info);
      client.query("SELECT EXISTS (SELECT 1 FROM users WHERE email LIKE '%"+ info.email +"%')", (err, result) => {
        if (err) {
          return console.error("error running query", err);
        }
        console.log(result.rows[0])
        if (result.rows[0].exists == false){
            client.query("INSERT INTO users (first_name, last_name, email) VALUES ('" + info.given_name + "', '" + info.family_name + "', '" + info.email + "')", (err, result) => {
              if (err) {
                return console.error("error inserting query", err);
              }
            });
        } else {
            if(result.rows[0].first_name = null){
              client.query("UPDATE users SET first_name = '"+ info.given_name +"', last_name = '"+ info.famil_name +"' WHERE email = '" + info.email + "'", (err, result) => {
                if (err) {
                  return console.error("error inserting query", err);
                }
              });
            }
          }
        client.query("SELECT id FROM users WHERE email LIKE '%" + info.email + "%'", (err, result) => {
          if (err) {
            return console.error("error inserting query", err);
          }
          console.log(result.rows);
          id = result.rows[0].id;

        activeusers[info.email] = {count: 0};
        console.log("ACTIVE USERS: ", activeusers);
        var post = JSON.stringify(id);

        console.log("post:", post);
        res.setHeader('Content-Type', 'application/json');
        res.send(post);
        });
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
      res.sendStatus(200);
    });
  });
});

app.get("/logout/:id", (req, res, next) => {
  client.query("SELECT email FROM users WHERE id = " + req.params.id, (err, result) => {
    if (err) {
      return console.error("error inserting query", err);
    }
    email = result.rows[0].email;
    console.log("user ",email,"removed from active users");
    delete activeusers[email];
    res.sendStatus(200);
  });
});

app.get("/contacts/:id", (req, res, next) => {

  var id = req.params.id;
  var results = '';
  var namelist = [];
  var idlist = ''

  client.query("SELECT * FROM contacts WHERE owner_id = " + id, (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    for(var i = 0; i < result.rows.length; i ++){
      if(i===0){
        idlist += result.rows[i].contact_id;
      }else{
      idlist += ', ' + result.rows[i].contact_id;
      }
      namelist.push(result.rows[i].nickname);
    }

    client.query("SELECT email FROM users WHERE id IN ("+ idlist +")", (err, result) => {
      if (err) {
       return console.error("error running query", err);
      }
      results += '{ "users" : ['
      for (var i = 0; i < result.rows.length; i ++){
        if(i===0){
          results += '{ "email":"' + result.rows[0].email + '", "nickname":"' + namelist[i] + '" }'
        }else{
          results += ', { "email":"' + result.rows[0].email + '", "nickname": "' + namelist[i] + '" }'
        }
      }
      results += " ]}"
      res.status(200).send(results);
    });
  });

});

app.post("/insert/:id", (req, res, next) => {
  addContact(req.body.id, req.body.email, req.body.nickname);
  res.sendStatus(200);
});

app.post("/contacts/id", (req, res, next) => {

  https.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+req.body.firstParam, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var info = JSON.parse(data)
      email = info.email;
      console.log(email);

      res.sendStatus(200);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.sendStatus(200);
  });
});

// app.get("/update", (req, res) => {
//   updateContact(req.body.user, req.body.email, req.body.name);
//   console.log(req.params.id, req.body.email, req.body.name);
//   res.sendStatus(200);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});