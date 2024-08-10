const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

const endpoint = 'http://localhost:5000'

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password 

  const errorMsg = "Failed to register new user"

  if (!username ||  !password) {
    return res.status(400).json({message: errorMsg})
  }

  const user = users.find(u => u.username === username)
  if (user) {
    return res.status(400).json({message: errorMsg})
  }

  users.push({ username, password })
  
  return res.status(200).json({message: "Successfully register new user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const resp = {
    data: books
  }
  return res.status(200).json(resp);
});

public_users.get('/promise/books', async function(req, res) {

  try {
    const result = await axios.get(`${endpoint}/`)
    const data = result.data
    return res.status(200).json(data) 
  } catch(e) {
    console.log(e.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
  
} )

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  book.isbn = isbn
  if (!book) {
    return res.status(404).json({message: 'Book is not found'})
  }

  return res.status(200).json(book);
});


public_users.get('/promise/books/isbn/:isbn', async function(req, res) {
  const isbn = req.params.isbn

  try {
    const result = await axios.get(`${endpoint}/isbn/${isbn}`)
    const data = result.data
    return res.status(200).json(data) 
  } catch(e) {
    console.log(e.message)
    return res.status(500).json({ message: 'Internal server error' })
  }

} )
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let keys = Object.keys(books)
  let items = keys.map(key => {
    let item = books[key]
    item.isbn = key
    return item
  })

  const author = req.params.author
  let data = items.filter(item => item.author === author)

  return res.status(200).json({
    author,
    books: data
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let keys = Object.keys(books)
  let items = keys.map(key => {
    let item = books[key]
    item.isbn = key
    return item
  })

  const title = req.params.title
  let data = items.find(item => item.title === title)
  if (!data) {
    return res.status(404).json({ message: "Book is not found"})
  }
  return res.status(200).json({book: data});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let keys = Object.keys(books)
  let items = keys.map(key => {
    let item = books[key]
    item.isbn = key
    return item
  })

  const isbn = req.params.isbn
  const book = items.find(item => item.isbn === isbn)
  if (!book) {
    return res.status(404).json({message: 'Book is not found'})
  }

  return res.status(200).json({isbn: book.isbn, title: book.title, reviews: book.reviews || []});
});

module.exports.general = public_users;
