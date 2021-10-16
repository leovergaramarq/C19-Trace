var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', {
    page: 'home',
    title: 'Home - C19-Trace',
    // body: fs.readFileSync('./views/index.ejs', 'utf8'),
  });
});
router.get('/about', function(req, res, next) {
  res.render('layout', {
    page: 'about',
    title: 'About - C19-Trace',
    // body: fs.readFileSync('./views/about.ejs', 'utf8'),
  });
});
router.get('/explore', function(req, res, next) {
  res.render('layout', {
    page: 'explore',
    title: 'Explore - C19-Trace',
    // body: fs.readFileSync('./views/explore.ejs', 'utf8')
  });
});
router.get('/*', function(req, res, next) {
  res.render('404', { title: 'Express' });
});
module.exports = router;
