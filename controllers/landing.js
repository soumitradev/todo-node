var todoModel = require("../models/todoModel");

// Render home page
exports.home_get = async function home_get(req, res) {
    return res.render('home');
}

// Render a todo page
exports.todo_get = async function todo_get(req, res) {
    let id = req.params.id;
    try {
        const doc = await todoModel.findById(id);
        if (!doc) return res.status(404).render('404');
        return res.render('view');
    } catch (err) {
        return res.status(500).json(err);
    }
}

// Render public todo page (only has the 20 latest todos.)
exports.get_all = async function get_all(req, res) {
    try {
        const doc = await todoModel.find({ private: false }).limit(20);
        return res.render('all', { doc: doc });
    } catch (err) {
        return res.status(500).json(err);
    }
}
