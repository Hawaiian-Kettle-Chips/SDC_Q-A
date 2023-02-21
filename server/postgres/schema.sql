--postgres

DROP DATABASE IF EXISTS qna_api;
CREATE DATABASE qna_api;

\c qna_api;

CREATE TABLE questions(
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  body VARCHAR NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name VARCHAR NOT NULL,
  asker_email VARCHAR NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  helpful INT DEFAULT 0
);

CREATE TABLE answers(
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id),
  body VARCHAR NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name VARCHAR NOT NULL,
  answerer_email VARCHAR NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  helpful INT DEFAULT 0
);

CREATE TABLE photos(
  id SERIAL PRIMARY KEY,
  answer_id INT REFERENCES answers(id),
  url VARCHAR
);

\COPY questions FROM 'data/questions.csv' DELIMITER ',' csv header;
\COPY answers FROM 'data/answers.csv' DELIMITER ',' csv header;
\COPY photos FROM 'data/answers_photos.csv' DELIMITER ',' csv header;

-- change type of date_written column to timestamp, can store ISO times in date_written now
-- Maybe use ETL for this? This is ELT...
ALTER TABLE answers ALTER COLUMN date_written TYPE TIMESTAMP USING to_timestamp(date_written/1000);
ALTER TABLE questions ALTER COLUMN date_written TYPE TIMESTAMP USING to_timestamp(date_written/1000);

SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));
SELECT setval('answers_id_seq', (SELECT MAX(id) FROM answers));
SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos));

-- Create indexes on what where condition is called on: product_id, question_id, and answer_id
CREATE INDEX product_id_index ON questions(product_id);
CREATE INDEX question_id_index ON answers(question_id);
CREATE INDEX answer_id_index ON photos(answer_id);
