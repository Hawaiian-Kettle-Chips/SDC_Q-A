-- sudo -u postgres psql < server/postgres/injectTestData.sql

\c qna_api;

\COPY questions FROM 'data/test_questions.csv' DELIMITER ',' csv header;
\COPY answers FROM 'data/test_answers.csv' DELIMITER ',' csv header;
\COPY photos FROM 'data/test_answers_photos.csv' DELIMITER ',' csv header;
