var todoModel = require("../models/todoModel");

// TODO Move endpoints to routes/
exports.home_get = async function home_get(req, res) {
    return res.render('home');
}

exports.todo_get = async function todo_get(req, res) {
    let id = req.params.id;
    try {
        const doc = await todoModel.findById(id);
        if (!doc) return res.status(404).render();
        return res.render('view');
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.get_all = async function get_all(req, res) {
    try {
        const doc = await todoModel.find({ private: false });
        return res.render('all', { doc: doc });
    } catch (err) {
        return res.status(500).json(err);
    }
}