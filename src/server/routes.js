const router = require('express').Router();

const transaction = require('./../resources/transaction');
const payable = require('./../resources/payable');

const notAllowed = require('./../middlewares/not-allowed');

router.get('/', (req, res) => res.status(200).send('up'))
router.get('/health', (req, res) => res.sendStatus(200));
router.post('/transactions', transaction.create);
router.get('/transactions', transaction.index);
router.all('/transactions', notAllowed);
router.get('/payables', payable.index);


module.exports = router;