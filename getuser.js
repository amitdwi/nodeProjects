const express = require('express');
const app = express();
const PORT = 3000;

const users = [
    {id: 1, name: "Amit", age: 30},
    {id: 2, name: "Ronit", age: 25},
    {id: 3, name: "Jitendra", age: 35},
    {id: 4, name: "Sai", age: 40},
    {id: 5, name: "Praj", age: 28}
]

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
