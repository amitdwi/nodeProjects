import express, { Request, Response } from 'express';
import User from '../models/User';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('User routes working');
});

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).send({ user, message: "User Created Successfully" });
    }
    catch (err) {
        res.status(400).send({ error: err });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User does not exist');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Unable to login');
        }
        const token = jwt.sign({
            _id: user._id.toString()
        }, process.env.SIGNATURE_KEY as string);
        res.send({ user, token, message: 'Successfully login' });
    }
    catch (err) {
        res.status(400).send({ error: err });
    }
});

export default router;
