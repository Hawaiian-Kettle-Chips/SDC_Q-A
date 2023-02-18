const router = require('express').Router();
const controller = require('./controller');

router.get('/', (req, res) => {
  res.status(200).send('Howdy');
})

router.get('/qa/questions', controller.getQuestionsByProductId);

module.exports = router;