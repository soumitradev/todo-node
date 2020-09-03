const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// I wanted to use this for desc and body but idk why it didn't work.
function allowEmpty() {
    return typeof (this.myField) === 'string' ? false : true;
}

// Schemas for tasks
// TODO move to models
const taskSchema = new Schema({
    body: { type: String, required: false },
    done: { type: Boolean, required: true },
});

const todoSchema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: false },
    tasks: [{ type: taskSchema, required: true }],
});

const todoModel = mongoose.model('todoList', todoSchema, 'todos');

module.exports = todoModel;