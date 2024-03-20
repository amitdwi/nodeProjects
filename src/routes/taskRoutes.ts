import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/auth';
import Task from '../models/Task';
import { Document } from 'mongodb';
// import * as redis from 'redis';
import { createClient } from "redis";
// import redisClient from '../redisdb';
import dotenv from 'dotenv';
dotenv.config();

interface RequestWithUser extends Request {
    user?: { _id?: string };
}

const router: Router = express.Router();

// Connect to REDIS cloud

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15645.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15645
    }
});


// const redisClient = createClient(redisConfig);

redisClient
   .connect()
   .then(() => {
    console.log('Redis connected ::');
   })
   .catch((err) => {
    console.log('error :', err);
});

// Middleware to cache tasks
// async function cacheTasks(req: RequestWithUser, res: Response, next: Function) {
//     const userId = req.user?._id as string;
//     const cacheData = await redisClient.get(userId);
//     if(cacheData) {
//         res.json(cacheData);
//         return;
//     }
//     next();
// }

// create a task
router.post('/', auth, async (req: RequestWithUser, res: Response) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user?._id
        });
        await task.save();
        res.status(201).json({ message: "Task Created Successfully" });
    }
    catch (err) {
        res.status(400).send({ error: err });
    }
});

// get user tasks
router.get('/', auth, async (req: RequestWithUser, res: Response) => {
    try {
        const tasks = await Task.find({
            owner: req.user?._id
        });
        // Cache tasks
        // (redisClient as any).set(req.user?._id, 3600, JSON.stringify(tasks));
        res.status(200).json({ count: tasks.length, tasks, message: "Tasks Fetched Successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: err });
    }
});

// fetch a task by id
router.get('/:id', auth, async (req: RequestWithUser, res: Response) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findOne({
            _id: taskId,
            owner: req.user?._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ task, message: "Task Fetched Successfully" });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

// update a task by id
router.patch('/:id', auth, async (req: RequestWithUser, res: Response) => {
    const taskId = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid Updates" });
    }
    try {
        const task: Document | null = await Task.findOne({
            _id: taskId,
            owner: req.user?._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.json({
            message: "Task Updated Successfully",
        });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

// delete a task by id
router.delete('/:id', auth, async (req: RequestWithUser, res: Response) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findOneAndDelete({
            _id: taskId,
            owner: req.user?._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task Deleted Successfully" });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

export default router;
