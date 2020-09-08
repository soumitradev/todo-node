const express = require('express');
const router = express.Router();

const api_endpoints = require('../api/endpoints');

// API home endpoint
router.get('/', api_endpoints.home_get);

// GET all endpoints
router.get('/todos', api_endpoints.get_all);
router.get('/todos/:limit', api_endpoints.get_all_limited);

// Single todo operation endpoints
router.post('/todo', api_endpoints.create_todo);
router.get('/todo/:id', api_endpoints.get_todo);
router.put('/todo', api_endpoints.update_todo);
router.delete('/todo/:id', api_endpoints.delete_todo);

module.exports = router;
