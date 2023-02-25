require ('dotenv').config();
const router = require('express').Router();
const controller = require('./controller');

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.get(`/${process.env.LOADER_IO}`, (req, res) => {
  res.send(process.env.LOADER_IO);
});

router.get('/qa/questions', controller.getAllQuestionsByProductId);

router.get('/qa/questions/:question_id/answers', controller.getAnswersByQuestionId);

router.post('/qa/questions/', controller.addQuestionById);

router.post('/qa/questions/:question_id/answers', controller.addAnswerById);

router.put('/qa/questions/:question_id/helpful', controller.updateQuestionHelpful);

router.put('/qa/questions/:question_id/report', controller.handleQuestionReport);

router.put('/qa/answers/:answer_id/helpful', controller.updateAnswerHelpful);

router.put('/qa/answers/:answer_id/report', controller.handleAnswerReport);

// Routes from FEC Mecca
// router.get('/qa/questions', controllers.questions.getAllQuestionsByProductId);
// router.get('/qa/questions/:question_id/answers', controllers.questions.getAnswersByQuestionId);
// router.post('/qa/questions/', controllers.questions.addQuestionById);
// router.post('/qa/questions/:question_id/answers', controllers.questions.addAnswerById);
// router.put('/qa/questions/:question_id/helpful', controllers.questions.updateQuestionHelpful);
// router.put('/qa/questions/:question_id/report', controllers.questions.handleQuestionReport);
// router.put('/qa/answers/:answer_id/helpful', controllers.questions.updateAnswerHelpful);
// router.put('/qa/answers/:answer_id/report', controllers.questions.handleAnswerReport);

module.exports = router;