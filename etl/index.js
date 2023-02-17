// working etl for test data set
const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transformer = require('stream').Transform;


const csvStringifier = createCsvStringifier({
  header: [{
    id: 'id', title: 'id'
  }, {
    id: 'product_id', title: 'product_id'
  }, {
    id: 'body', title: 'body'
  }, {
    id: 'date_written', title: 'date_written'
  }, {
    id: 'asker_name', title: 'asker_name'
  }, {
    id: 'asker_email', title: 'asker_email'
  }, {
    id: 'reported', title: 'reported'
  }, {
    id: 'helpful', title: 'helpful'
  }]
});

let readStream = fs.createReadStream("./data/test_questions.csv");
let writeStream = fs.createWriteStream("./data/cleaned_test_questions.csv");

class Cleaner extends Transformer {
  constructor(options) {
    super(options);
  }
  _transform(chunk, encoding, callback) {
    // some transformation/cleaning here (using example code for now)
    for (let key in chunk) {
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) {
        delete chunk[key];
      }
    }

    let onlyIdNumbers = chunk.id.replace(/\D/g, '');
    let onlyProductIdNumbers = chunk.product_id.replace(/\D/g, '');
    let onlyBody = chunk.body.slice(0, 1000);
    let onlyDateNumbers = chunk.date_written.replace(/\D/g, '');
    let onlyName = chunk.asker_name.slice(0, 100);
    let onlyHelpfulNumbers = chunk.helpful.replace(/\D/g, '');


    chunk.id = onlyIdNumbers;
    chunk.product_id = onlyProductIdNumbers;
    chunk.body = onlyBody;
    chunk.date_written = onlyDateNumbers;
    chunk.asker_name = onlyName;
    chunk.helpful = onlyHelpfulNumbers;

    chunk = csvStringifier.stringifyRecords([chunk]);

    let commaCount = 0;
    let quoteInsertIndex;

    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === ',') {
        commaCount++;
        if (commaCount === 2) {
          quoteInsertIndex = i + 1;
        }
      }
    }

    let text = chunk.slice(0, quoteInsertIndex) + '"' + chunk.slice(quoteInsertIndex).trim();
    // console.log('text', text);
    let result = text.concat(`"\n`);
    // console.log('result', result);

    this.push(result);

    callback();
  }
}

const transformer = new Cleaner({ objectMode: true });

writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream);
