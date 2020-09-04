var todoModel = require("../models/todoModel");
const { nanoid } = require('nanoid');

// TODO Move endpoints to routes/
exports.home_get = async function home_get(req, res) {
    res.json({
        message: "Welcome to the badly named Todo API",
    });
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

        added = await todo.save();
        res.status(201).json(added);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.get_todo = async function get_todo(req, res) {
    let id = req.params.id;
    try {
        const doc = await todoModel.findById(id);
        if (!doc) return res.status(404).json({ message: 'Todo list not found' });
        return res.status(200).json(doc);
    } catch (err) {
        return res.status(500).json(err);
    }
}


exports.get_all = async function get_all(req, res) {
    try {
        const doc = await todoModel.find({});
        res.status(200).json(doc);
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.update_todo = async function update_todo(req, res) {
    let title = req.body.title;
    let desc = req.body.desc;
    let tasks = req.body.tasks;
    let id = req.body.id;

    if (req.body.nid && await todoModel.findById(req.body.nid)) {
        return res.status(400).json({
            status: 'error',
            error: 'id already taken',
        });
    }
    
    let nid = req.body.nid ? req.body.nid : id;

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
            _id: nid,
        });
        await todoModel.findByIdAndDelete(id);
        upd = await todo.save();
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
