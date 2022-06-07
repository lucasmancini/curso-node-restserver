
const { Router } = require('express');

const {
    searchDB
} = require('../controllers/search');

const router = new Router();


router.get('/:collection/:query', searchDB);

module.exports = router;