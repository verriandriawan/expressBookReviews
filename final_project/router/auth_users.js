const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if (!username || !password) {
    return false
  }

  const user = users.find(u => u.username === username) 
  if (!user) {
    return false
  }

  if (user.password !== password) {
    return false
  }

  return true

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  const secretKey = 'access'

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: username}, secretKey,
      { expiresIn: 60 * 60 }
    )

    req.session.authorization = { accessToken, username  }
    return res.status(200).json({message: "Succsesfully login"});
  }
  
  return res.status(401).json({message: "Failed to login"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
