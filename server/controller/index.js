const db = require('../postgres/index.js');

module.exports = {
  getQuestionsByProductId: (req, res) => {
    const count = req.query.count || 5;
    let page = req.query.page || 1;
    page = (page - 1) * count;

    const queryString = `SELECT json_build_object(
      'product_id', ${req.query.product_id},
      'results', (
        WITH questionRows AS (SELECT * FROM questions WHERE product_id = ${req.query.product_id} AND reported = false LIMIT ${count} OFFSET ${page})
        SELECT json_agg(json_build_object(
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
        )) FROM questionRows
      )
    )`;

    db.query(queryString)
      .then((results) => {
        res.status(200).send(results.rows[0].json_build_object)
      })
      .catch((err) => {
        console.log('Error getting questions: ', err)
        res.status(500).send(err);
      });
  },
};