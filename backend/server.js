const express = require('express');
const cors = require('cors');
const fs = require('fs');



const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//read the data from the json file
const readData = () => {
    try {
        const data = fs.readFileSync('../database/database.json', 'utf-8'); 
        return JSON.parse(data); 
    } catch (err) {
        throw new Error('Could not read the database file');
    }
}

// Read all books in the database
app.get('/books', (req, res) => {
    console.log('inside the get all operator');
    try {
        const data = readData();
        res.json(data.books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Read book by id
app.get('/books/:id', (req, res) => {
    console.log(`inside get by id operation, the id is : ${req.params.id}`);
    try {
        const data = readData();
        const book = data.books.find(b => b.id == req.params.id);

        if (book) {
            console.log(`the given book is: ${book}`);
            res.json(book);
        } else {
            res.status(404).json({ message: 'book not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//create new book 
app.post('/books/', (req, res) => {

    console.log('inside the post operator');
    const data = readData()

    const newBook = req.body;
    if (!newBook) {
        res.status(400).json('new book is missing')
    }

    data.books.push(newBook)
    res.status(201).json({message: 'book created successfully' , book: newBook})

})

//uptade the book by id
app.put('/books/:id' , (req, res) => {
    console.log('inside the put operation');
    const data = readData();
    const bookIndex = data.findIndex( b => b.id == req.params.id);
    const updateBook = req.body;

    if(bookIndex == -1 ){
        res.status(404).json( {message: 'book not found to update'})
    }

    data[bookIndex] = {...data[bookIndex] , ...updateBook};

    res.status(200).json({massege: 'book update seccessfully' , book: data[bookIndex]})
});

//delete the book by id
app.delete('/books/:id' , ( req , res ) => {

    console.log('inside the delete operation')
    const data = readData();
    const bookIndex = data.findIndex( b => b.id == req.params.id );
    data.splice(bookIndex , 1 )
    res.status(200).json({message: `book id: ${req.params.id} delete seccessfully ` })
})


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})