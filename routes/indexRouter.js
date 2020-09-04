const express = require('express');
const router = express.Router();

const frontend = require('../controllers/landing');

router.get('/', frontend.home_get);

router.get('/todo/:id', frontend.todo_get);

module.exports = router;
