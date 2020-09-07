var todoModel = require("../models/todoModel");
const { nanoid } = require('nanoid');

// Import stuff we'll need for the API endpoints

// Get home of API
exports.home_get = async function home_get(req, res) {
    res.json({
        message: "Welcome to the badly named Todo API. Read the documentation at `/docs` !",
    });
}

// Create a todo list
exports.create_todo = async function create_todo(req, res) {

    // Get request data
    let title = req.body.title;
    let desc = req.body.desc;
    let tasks = req.body.tasks;
    let id = req.body.id;
    let priv = req.body.private;

    // Start try catch block to process any errors during Schema validation, saving etc.
    try {
        // If no id is provided, generate a unique id using nanoid
        if (!id) {
            id = nanoid(10);
            while (await todoModel.findById(id)) {
                id = nanoid(10);
            }
        }

        // Create the todo Instance and try saving it.
        let todo = new todoModel({
            title: title,
            desc: desc,
            tasks: tasks,
            _id: id,
            private: priv,
        });

        // Save and return repsonse
        added = await todo.save();
        return res.status(201).json(added);
    } catch (err) {
        // If any error is found in request, return the error
        return res.status(400).json(err);
    }
}

// Get a todo list
exports.get_todo = async function get_todo(req, res) {
    // Use the id to find the list. If no such list exists, return 404
    let id = req.params.id;
    try {
        const doc = await todoModel.findById(id);
        if (!doc) return res.status(404).json({ message: 'Todo list not found' });
        return res.status(200).json(doc);
    } catch (err) {
        // Catch any internal server error
        return res.status(500).json(err);
    }
}

// Get all public todo lists
exports.get_all = async function get_all(req, res) {
    try {
        const doc = await todoModel.find({ private: false });
        return res.status(200).json(doc);
    } catch (err) {
        // Catch any internal server error
        return res.status(500).json(err);
    }
}

// Update a todo
exports.update_todo = async function update_todo(req, res) {
    let title = req.body.title;
    let desc = req.body.desc;
    let tasks = req.body.tasks;
    let id = req.body.id;
    let priv = req.body.private;

    // If new id is not provided, fall back to id
    let nid = req.body.nid ? req.body.nid : id;

    try {
        // If the todo doesnt exist, create it.
        const doc = await todoModel.findById(id);
        if (!doc) {
            // If id is given, create with information provided
            if (id) {
                let todo = new todoModel({
                    title: title,
                    desc: desc,
                    tasks: tasks,
                    _id: id,
                    private: priv,
                });

                added = await todo.save();
                return res.status(201).json(added);
            }

            // If id is not provided, generate a unique id, and save the todo.
            id = nanoid(10);
            while (await todoModel.findById(id)) {
                id = nanoid(10);
            }

            let todo = new todoModel({
                title: title,
                desc: desc,
                tasks: tasks,
                _id: id,
                private: priv,
            });

            added = await todo.save();
            return res.status(201).json(added);
        }

        // If a todo exists, update it with existing fields and new fields
        title = title ? title : doc.title;
        desc = desc ? desc : doc.desc;
        tasks = tasks ? tasks : doc.tasks;
        priv = priv ? priv : doc.private;

        let todo = new todoModel({
            title: title,
            desc: desc,
            tasks: tasks,
            _id: nid,
            private: priv,
        });

        // If the todo isnt being moved, delete the old todo and create a new one on its place (Prolly should use Mongoose's Update function)
        if (id === nid) {
            await todoModel.findByIdAndDelete(id);
            upd = await todo.save();
        } else {
            // If todo is being moved, check if a todo exists at new id
            if (await todoModel.findById(nid)) {
                // If it does, try to save the current todo. This will raise a MongoError, which we will return
                upd = await todo.save();
            } else {
                // If todo can be moved, move it.
                await todoModel.findByIdAndDelete(id);
                upd = await todo.save();
            }
        }

        // Return new todo
        return res.status(200).json(todo);
    } catch (err) {
        // Catch any error with request
        return res.status(400).json(err);
    }
}

// Delete a todo
exports.delete_todo = async function delete_todo(req, res) {
    let id = req.params.id;
    try {
        // Delete and return todo if found, else return 404
        const doc = await todoModel.findByIdAndDelete(id);
        if (!doc) return res.status(404).json({ message: 'Todo list not found' });
        return res.status(200).json(doc);
    } catch (err) {
        // Catch any internal server error
        return res.status(500).json(err);
    }
}
