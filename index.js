const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

require('./db');

app.use(bodyParser.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Task manager API is working fine'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
