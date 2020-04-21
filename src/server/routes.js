const router = require('express').Router();

const transaction = require('./../resources/transaction');
const notAllowed = require('./../middlewares/not-allowed');

router.get('/', (req, res) => {
    res.status(200).send('up');
})

router.post('/transactions', transaction.create);
router.get('/transactions', transaction.index);
router.all('/transactions', notAllowed);

module.exports = router;