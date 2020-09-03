const express = require('express');
const router = express.Router();

const api_endpoints = require('../api/endpoints');

router.get('/', api_endpoints.home_get);

router.post('/todo', api_endpoints.create_todo);
router.get('/todo/:id', api_endpoints.get_todo);
router.put('/todo', api_endpoints.update_todo);
router.delete('/todo/:id', api_endpoints.delete_todo);

module.exports = router;
