--postgres

DROP DATABASE IF EXISTS qna_api;
CREATE DATABASE qna_api;

\c qna_api;

CREATE TABLE questions {
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  body VARCHAR NOT NULL,
  date_written DATE NOT NULL,
  asker_name VARCHAR NOT NULL,
  asker_email VARCHAR NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  helpful INT DEFAULT 0
}

CREATE TABLE answers {
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL,
  body VARCHAR NOT NULL,
  date_written DATE NOT NULL,
  answerer_name VARCHAR NOT NULL,
  answerer_email VARCHAR NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  helpful INT DEFAULT 0
  FOREIGN KEY (question_id) REFERENCES questions(id)
}

CREATE TABLE photos {
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR
  FOREIGN KEY (answers_id) REFERENCES answers(id)
}

COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
  FROM '/data/cleaned_test_questions.csv' DELIMITER ','
  NULL AS 'null' CSV HEADER;