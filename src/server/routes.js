const router = require('express').Router();
const notAllowed = require('./../middlewares/not-allowed');

const transaction = require('./../resources/transaction');
const payable = require('./../resources/payable');
const dashboard = require('./../resources/dashboard');


router.get('/', (req, res) => res.status(200).send('up'));
router.get('/health', (req, res) => res.sendStatus(200));
router.post('/transactions', transaction.create);
router.get('/transactions', transaction.index);
router.get('/transactions/:id', transaction.show);
router.all('/transactions', notAllowed);
router.get('/payables', payable.index);
router.all('/payables', notAllowed);
router.get('/dashboard', dashboard.index);
router.all('/dashboard', notAllowed);


module.exports = router;
