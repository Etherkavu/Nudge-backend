var express = require("express");
var app = express();
var cors = require('cors');
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

console.log(`PROCESS ENV DATABASE_URL: ${process.env.DATABASE_URL}`);

var myVar = setInterval(checkInCheck, 5000);

var activeusers = {
  'moo@moo.moo': {count: 5
  }
};

 app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

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
        //   sendEmail(emails[i]);
        // }
      });
      });
     });
 console.log('EMAIL SENT!');
 activeusers[user].count = 0;
    }
  };
}

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
// async function pullContacts(user){
//   var results = '';
//   var namelist = [];
//   var idlist = ''
//   client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
//     if (err) {
//       return console.error("error running query", err);
//     }
//     client.query("SELECT * FROM contacts WHERE owner_id = " + result.rows[0].id, (err, result) => {
//       if (err) {
//         return console.error("error running query", err);
//       }
//       for(var i = 0; i < result.rows.length; i ++){
//         if(i===0){
//           idlist += result.rows[i].contact_id;
//         }else{
//         idlist += ', ' + result.rows[i].contact_id;
//         }
//         namelist.push(result.rows[i].nickname);
//       }

//       client.query("SELECT email FROM users WHERE id IN ("+ idlist +")", (err, result) => {
//         if (err) {
//          return console.error("error running query", err);
//         }
//         results += '{ "users" : ['
//         for (var i = 0; i < result.rows.length; i ++){
//           if(i===0){
//             results += '{ "email":"' + result.rows[0].email + '", "nickname":"' + namelist[i] + '" }'
//           }else{
//             results += ', { "email":"' + result.rows[0].email + '", "nickname": "' + namelist[i] + '" }'
//           }

//         }
//         results += " ]}"
//         console.log(results);
//         return results;
//       });
//     });
//   });
// }

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



var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get("/ping", cors(corsOptions), (req, res, next) => {
  console.log("Hey look we made it here");
  activeusers['moo@moo.moo'] = {count: 0};
  res.sendStatus(200);
});

app.get("/login", cors(corsOptions), (req, res, next) => {
  activeusers[req.body.id] = {count : 0}
  res.sendStatus(200);
});

app.get("/logout", cors(corsOptions), (req, res, next) => {
  delete activeusers[req.body.id];
  res.sendStatus(200);
});

app.get("/contacts", cors(corsOptions), (req, res, next) => {
  var user = 'moo@moo.moo'
  var results = '';
  var namelist = [];
  var idlist = ''
  client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    client.query("SELECT * FROM contacts WHERE owner_id = " + result.rows[0].id, (err, result) => {
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
        console.log(results);
        res.status(200).send(results);
      });
    });
  });
});

app.get("/insert", cors(corsOptions), (req, res, next) => {
  addContact(req.body.user, req.body.email, req.body.nickname);
  res.sendStatus(200);
});

app.post("/contacts", cors(corsOptions), (req, res, next) => {
  // register(req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.contact_name, req.body.contact_email);
  console.log("first param:", req.body.firstParam);
  console.log("req body:", req.body);

  res.sendStatus(200);
});

// app.get("/update", cors(corsOptions), (req, res) => {
//   updateContact(req.body.user, req.body.email, req.body.name);
//   console.log(req.params.id, req.body.email, req.body.name);
//   res.sendStatus(200);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});