const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Listening to requests.')
});

module.exports = router;