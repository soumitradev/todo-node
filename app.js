const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');

const port = 3000;
const app = express();

mongoose.connect('mongodb+srv://soumitradev:Ghx46t2ayHAb2UA@todoapp.0zonn.gcp.mongodb.net/todo_data?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on('error', (err) => {
    console.error('Error connecting to DB: ' + err);
});

db.on('open', () => {
    console.log('Connected to DB');
});

const Schema = mongoose.Schema;


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

app.use(cors());
app.use(express.json());

// TODO Move endpoints to routes/
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the badly named Todo API",
    });
});

app.post('/api/v1/todo', async (req, res) => {
    let title = req.body.title;
    let desc = req.body.desc;
    let tasks = req.body.tasks;
    let id = req.body.id;
    // User can specify id
    try {
        if (!id) {
            id = nanoid(10);
            while (await todoModel.findById(id)) {
                id = nanoid(10);
            }
        } else {
            if (await todoModel.findById(id)) {
                return res.status(400).json({
                    status: 'error',
                    error: 'id already taken',
                });
            }
        }

        let todo = new todoModel({
            title: title,
            desc: desc,
            tasks: tasks,
            _id: id,
        });

        added = await todo.save();
        res.status(201).json(added);
    } catch (err) {
        res.status(400).json(err);
    }
});

app.get('/api/v1/todo/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const doc = await todoModel.findById(id);
        if (!doc) return res.status(404).json({ message: 'Todo list not found' });
        return res.status(200).json(doc);
    } catch (err) {
        return res.status(500).json(err);
    }
});

app.put('/api/v1/todo/', async (req, res) => {
    let title = req.body.title;
    let desc = req.body.desc;
    let tasks = req.body.tasks;
    let id = req.body.id;

    try {
        const doc = await todoModel.findById(id);
        if (!doc) return res.status(404).json({ message: 'Todo list not found' });

        title = title ? title : doc.title;
        desc = desc ? desc : doc.desc;
        tasks = tasks ? tasks : doc.tasks;

        let todo = new todoModel({
            title: title,
            desc: desc,
            tasks: tasks,
            _id: id,
        });
        upd = await doc.updateOne(todo);
        res.status(200).json(upd);
    } catch (err) {
        return res.status(500).json(err);
    }
});


app.delete('/api/v1/todo/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const doc = await todoModel.findByIdAndDelete(id);
        if (!doc) return res.status(404).json({ message: 'Todo list not found' });
        return res.status(200).json(doc);
    } catch (err) {
        return res.status(500).json(err);
    }
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
