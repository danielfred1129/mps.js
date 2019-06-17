var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hashing System' });
});

router.get('/quick-test', function (req, res) {
  res.render('test-page',{page:'Home', menuId:'home',message:'this is message'})
});

router.get('/insufficient-amount', function (req, res) {
  res.render('insufficient-amount',{page:'Insufficiant Amount', menuId:'insufficiant-amount'})
});

router.get('/isnotChrome', function (req, res) {
  res.render('test-page',{page:'Browser is not chrome', menuId:'Is not chrome',message:'The browser is not a chrome'})
});

router.get('/no-extension', function (req, res) {
  res.render('test-page',{page:'Hedera chrome extension is missing', menuId:'Chrome extension missing',message:'Chrome Extension is not installed in the browser'})
});

router.get('/account-not-paired', function (req, res) {
  res.render('test-page',{page:'Account is not paired', menuId:'Hedera Account is not paired',message:'Account has not been paired'})
});



module.exports = router;
