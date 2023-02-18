const db = require('../postgres/index.js');

module.exports = {
  getAllQuestionsByProductId: (req, res) => {
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    const actualPage = (page - 1) * count;

    const queryString = `SELECT * FROM questions WHERE product_id = ${req.query.product_id} AND reported = false LIMIT ${count} OFFSET ${actualPage}`
    // const queryString = `SELECT json_build_object(
    //   'product_id', ${req.query.product_id},
    //   'results', (
    //     SELECT json_agg(json_build_object(

    //     ))
    //   )
    // )`

    db.query(queryString)
      .then((results) => {
        console.log(results);
        res.status(200).send(results.rows)
      })
      .catch((err) => {
        console.log('Error getting questions: ', err)
        res.status(500).send(err);
      });
  },
};