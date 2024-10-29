const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Read the data from the JSON file
const readData = () => {
    try {
        const data = fs.readFileSync('../database/database.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Could not read the database file');
    }
}

// Write the data to the JSON file
const writeData = (data) => {
    try {
        fs.writeFileSync('../database/database.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        throw new Error('Could not write to the database file');
    }
}

// Read all books in the database
app.get('/books', (req, res) => {
    console.log('Inside the GET all operation');
    try {
        const data = readData();
        res.json(data.books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Read book by ID
app.get('/books/:id', (req, res) => {
    console.log(`Inside the GET by ID operation, the ID is: ${req.params.id}`);
    try {
        const data = readData();
        const book = data.books.find(b => b.id == req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new book
app.post('/books', (req, res) => {
    console.log('Inside the POST operation');
    const data = readData();
    const newBook = req.body;
    if (!newBook) {
        return res.status(400).json('New book data is missing');
    }
    data.books.push(newBook);
    writeData(data);
    res.status(201).json({ message: 'Book created successfully', book: newBook });
});

// Update the book by ID
app.put('/books/:id', (req, res) => {
    console.log('Inside the PUT operation');
    const data = readData();
    const bookIndex = data.books.findIndex(b => b.id == req.params.id);
    const updateBook = req.body;
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found to update' });
    }
    data.books[bookIndex] = { ...data.books[bookIndex], ...updateBook };
    writeData(data);
    res.status(200).json({ message: 'Book updated successfully', book: data.books[bookIndex] });
});

// Delete the book by ID
app.delete('/books/:id', (req, res) => {
    console.log('Inside the DELETE operation');
    const data = readData();
    const bookIndex = data.books.findIndex(b => b.id == req.params.id);
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found to delete' });
    }
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.status(200).json({ message: `Book with ID: ${req.params.id} deleted successfully` });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
