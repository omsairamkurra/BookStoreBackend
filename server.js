const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://omsairam:%40Bhi1998@cluster0.m7sx1gk.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  summary: String,
});

const Book = mongoose.model('Book', bookSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add a new book
app.post('/books', async (req, res) => {
  const { title, author, summary } = req.body;
  try {
    const newBook = new Book({ title, author, summary });
    const savedBook = await newBook.save();
    res.status(201).send(savedBook);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get by ID
app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).send('Book not found');
    } else {
      res.json(book);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update by ID
app.put('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { title, author, summary } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, { title, author, summary }, { new: true });
    if (!updatedBook) {
      res.status(404).send('Book not found');
    } else {
      res.json(updatedBook);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete by ID
app.delete('/books/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
      const book = await Book.findOneAndDelete({ _id: bookId });
  
      if (!book) {
        res.status(404).send('Book not found');
      } else {
        res.json({ message: 'Book deleted successfully' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
