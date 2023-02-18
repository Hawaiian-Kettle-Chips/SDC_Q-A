--postgres

DROP DATABASE IF EXISTS qna_api;
CREATE DATABASE qna_api;

\c qna_api;

CREATE TABLE questions(
  id INT PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  body VARCHAR NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name VARCHAR NOT NULL,
  asker_email VARCHAR NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  helpful INT DEFAULT 0
);

CREATE TABLE answers(
  id INT PRIMARY KEY,
  question_id INT REFERENCES questions(id),
  body VARCHAR NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name VARCHAR NOT NULL,
  answerer_email VARCHAR NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  helpful INT DEFAULT 0
);

CREATE TABLE photos(
  id INT PRIMARY KEY,
  answer_id INT REFERENCES answers(id),
  url VARCHAR
);

\COPY questions FROM 'data/questions.csv' DELIMITER ',' csv header;
\COPY answers FROM 'data/answers.csv' DELIMITER ',' csv header;
\COPY photos FROM 'data/answers_photos.csv' DELIMITER ',' csv header;

-- \COPY questions FROM 'data/test_questions.csv' DELIMITER ',' csv header;
-- \COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
--   FROM 'data/test_questions.csv' DELIMITER ','
--   NULL AS 'null' CSV HEADER;