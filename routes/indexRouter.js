const express = require('express');
const router = express.Router();

const frontend = require('../controllers/landing');

// Routes
router.get('/', frontend.home_get);
router.get('/todos', frontend.get_all);
router.get('/todo/:id', frontend.todo_get);

// 404
router.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = router;
