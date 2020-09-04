var todoModel = require("../models/todoModel");
const { nanoid } = require('nanoid');

// TODO Move endpoints to routes/
exports.home_get = async function home_get(req, res) {
    res.render('home');
}

exports.create_todo = async function create_todo(req, res) {
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

        var added = await todo.save();
        res.status(201).json(added);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.todo_get = async function get_todo(req, res) {
    let id = req.params.id;
    try {
        const doc = await todoModel.findById(id);
        if (!doc) return res.status(404).render();
        return res.render('view');
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.update_todo = async function update_todo(req, res) {
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
        res.status(200).json(todo);
    } catch (err) {
        return res.status(500).json(err);
    }
}


exports.delete_todo = async function delete_todo(req, res) {
    let id = req.params.id;
    try {
        const doc = await todoModel.findByIdAndDelete(id);
        if (!doc) return res.status(404).json({ message: 'Todo list not found' });
        return res.status(200).json(doc);
    } catch (err) {
        return res.status(500).json(err);
    }
}
