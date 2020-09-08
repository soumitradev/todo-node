const express = require('express');
const router = express.Router();
const path = require('path');
const mds = require('markdown-serve');

// Use markown-serve to serve docs.
router.use(mds.middleware({ 
    rootDirectory: path.resolve(__dirname, '../docs'),
    handler: function(markdownFile, req, res, next) {
        if (req.method !== 'GET') next();
        res.render('markdown', { title: markdownFile.meta.title, content: markdownFile.parseContent() });
    }
}));

// 404
router.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = router;
