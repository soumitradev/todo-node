const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// I wanted to use this for desc and body but idk why it didn't work.
function allowEmpty() {
    return typeof (this.myField) === 'string' ? false : true;
}


function arrayLimit(val) {
    return val.length <= 100;
}

// Schemas for tasks
// TODO move to models
const taskSchema = new Schema({
    body: {
        type: String,
        required: false,
        default: '',
        minlength: 0,
        maxlength: 200,
        trim: true,
    },
    done: {
        type: Boolean,
        required: true,
    },
});

const todoSchema = new Schema({
    _id: {
        type: String,
        required: true,
        match: /[\w\-]/i,
        minlength: 1,
        maxlength: 40,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        trim: true,
    },
    desc: {
        type: String,
        default: '',
        required: false,
        minlength: 0,
        maxlength: 400,
        trim: true,
    },
    private: {
        type: Boolean,
        required: true,
    },
    tasks: {
        type: [{
            type: taskSchema,
            required: true
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 100']
    },
});

const todoModel = mongoose.model('todoList', todoSchema, 'todos');

module.exports = todoModel;