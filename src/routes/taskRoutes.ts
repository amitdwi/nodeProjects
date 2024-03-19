import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/auth';
import Task from '../models/Task';
import { Document } from 'mongodb';


interface RequestWithUser extends Request {
    user?: { _id?: string };
}

const router: Router = express.Router();

// create a task
router.post('/', auth, async (req: RequestWithUser, res: Response) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user?._id
        });
        await task.save();
        res.status(201).json({message: "Task Created Successfully" });
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
        res.status(200).json({count: tasks.length, message: "Tasks Fetched Successfully" });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

// fetch a task by id
router.get('/:id', auth, async (req: RequestWithUser, res: Response) => {
    const taskid = req.params.id;
    try {
        const task = await Task.findOne({
            _id: taskid,
            owner: req.user?._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({message: "Task Fetched Successfully" });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

// update a task by id
router.patch('/:id', auth, async (req: RequestWithUser, res: Response) => {
    const taskid = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid Updates" });
    }
    try {
        const task:Document | null = await Task.findOne({
            _id: taskid,
            owner: req.user?._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        updates.forEach(update => task[update] = <typeof Task>req.body[update]);
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
    const taskid = req.params.id;
    try {
        const task = await Task.findOneAndDelete({
            _id: taskid,
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