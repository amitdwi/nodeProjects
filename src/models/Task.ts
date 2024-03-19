import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
    description: string;
    completed: string;
    owner: mongoose.Schema.Types.ObjectId;
}

const taskSchema: Schema = new Schema({
    description: { type: String, required: true },
    completed: { type: String, default: 'READY' },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
});

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;
