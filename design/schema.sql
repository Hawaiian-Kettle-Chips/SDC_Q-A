--postgres

DROP DATABASE IF EXISTS qna_api;
CREATE DATABASE qna_api;

USE qna_api;

CREATE TABLE 'questions' {
  question_id PRIMARY KEY INT,
  product_id INT NOT NULL,
  asker_name VARCHAR NOT NULL,
  question_body VARCHAR NOT NULL,
  question_date DATE NOT NULL,
  question_helpfulness INT DEFAULT 0,
  reported INT DEFAULT 0
  FOREIGN KEY (questions_id) REFERENCES answers(questions_id)
}

CREATE TABLE 'answers' {
  answer_id PRIMARY KEY INT,
  question_id INT NOT NULL,
  answerer_name VARCHAR NOT NULL,
  body VARCHAR NOT NULL,
  answer_date DATE NOT NULL,
  helpfulness INT DEFAULT 0,
  reported INT DEFAULT 0
  FOREIGN KEY (questions_id) REFERENCES questions(questions_id)
  FOREIGN KEY (answers_id) REFERENCES photos(answers_id)
}

CREATE TABLE 'photos' {
  photo_id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR NOT NULL
  FOREIGN KEY (answers_id) REFERENCES answers(answers_id)
}