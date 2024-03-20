import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import 'dotenv';
import './db';

const app = express();
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Task manager API is working fine'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
