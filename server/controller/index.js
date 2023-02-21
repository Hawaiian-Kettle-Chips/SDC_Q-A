const db = require('../postgres/index.js');

module.exports = {
  getAllQuestionsByProductId: (req, res) => {
    const count = req.query.count || 5;
    const page = req.query.page || 1;

    const queryString = `SELECT json_build_object(
      'product_id', ${req.query.product_id},
      'results', (
        WITH questionRows AS (SELECT * FROM questions WHERE product_id = ${req.query.product_id} AND reported = false LIMIT ${count} OFFSET ${page})
        SELECT COALESCE(json_agg(json_build_object(
          'question_id', id,
          'question_body', body,
          'question_date', date_written,
          'asker_name', asker_name,
          'question_helpfulness', helpful,
          'reported', reported,
          'answers', (
            WITH answerRows AS (SELECT * FROM answers WHERE question_id = questionRows.id AND reported = false)
            SELECT COALESCE(json_object_agg(
              id, json_build_object(
                'id', id,
                'body', body,
                'date', date_written,
                'answerer_name', answerer_name,
                'helpfulness', helpful,
                'photos', (
                  WITH photoRows AS (SELECT * FROM photos WHERE answer_id = answerRows.id)
                  SELECT COALESCE(json_agg(url), '[]'::json) FROM photoRows
                )
              )
            ), '{}'::json) FROM answerRows
          )
        )), '[]'::json) FROM questionRows
      )
    )`;

    db.query(queryString)
      .then((results) => {
        res.status(200).send(results.rows[0].json_build_object);
      })
      .catch((err) => {
        console.log('Error getting questions: ', err);
        res.status(500).send(err);
      });
  },
  getAnswersByQuestionId: (req, res) => {
    const count = req.query.count || 5;
    const page = req.query.page || 1;

    const queryString = `SELECT json_build_object(
      'question', ${req.params.question_id},
      'page', ${page},
      'count', ${count},
      'results', (
        WITH answerRows AS (SELECT * FROM answers WHERE question_id = ${req.params.question_id} AND reported = false)
        SELECT COALESCE(json_agg(json_build_object(
          'answer_id', id,
          'body', body,
          'date', date_written,
          'answerer_name', answerer_name,
          'helpfulness', helpful,
          'photos', (
            WITH photoRows AS (SELECT * FROM photos WHERE answer_id = answerRows.id)
            SELECT COALESCE(json_agg(url), '[]'::json) FROM photoRows
          )
        )), '[]'::json) FROM answerRows)
      )`;

    db.query(queryString)
      .then((results) => {
        res.status(200).send(results.rows[0].json_build_object);
      })
      .catch((err) => {
        console.log('Error getting answers: ', err);
        res.status(500).send(err);
      });
  },
  addQuestionById: (req, res) => {
    // req.body should contain body, name, email, product_id. Need value for date_written
    // reported and helpful have default values
    const queryString = `INSERT INTO questions (product_id, body, date_written, asker_name, asker_email)
      VALUES (${req.body.product_id}, '${req.body.body}', CURRENT_TIMESTAMP, '${req.body.name}', '${req.body.email}')`;

    db.query(queryString)
      .then(() => {
        res.status(201).send('Success');
      })
      .catch((err) => {
        console.log('Error posting question: ', err);
        res.status(500).send(err);
      });
  },
  addAnswerById: (req, res) => {
    // TODO: add support for posting photos
    const queryString = `INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email)
      VALUES (${req.params.question_id}, '${req.body.body}', CURRENT_TIMESTAMP, '${req.body.name}', '${req.body.email}')`;

    db.query(queryString)
      .then(() => {
        res.status(201).send('Success');
      })
      .catch((err) => {
        console.log('Error posting answer: ', err);
        res.status(500).send(err);
      });
  },
  updateQuestionHelpful: (req, res) => {
    const queryString = `UPDATE questions SET helpful = helpful + 1 WHERE id = ${req.params.question_id}`
    db.query(queryString)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('Error updating question: ', err);
        res.status(500).send(err);
      });
  },
  handleQuestionReport: (req, res) => {
    const queryString = `UPDATE questions SET reported = true WHERE id = ${req.params.question_id}`
    db.query(queryString)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('Error reporting question: ', err);
        res.status(500).send(err);
      });
  },
  updateAnswerHelpful: (req, res) => {
    const queryString = `UPDATE answers SET helpful = helpful + 1 WHERE id = ${req.params.answer_id}`
    db.query(queryString)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('Error updating answer: ', err);
        res.status(500).send(err);
      });
  },
  handleAnswerReport: (req, res) => {
    const queryString = `UPDATE answers SET reported = true WHERE id = ${req.params.answer_id}`
    db.query(queryString)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('Error reporting answer: ', err);
        res.status(500).send(err);
      });
  },
};