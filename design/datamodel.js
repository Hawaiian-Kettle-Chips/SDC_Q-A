// mongo
import mongoose from 'mongoose';
const { Schema } = mongoose;

// questions
const questionSchema = new Schema({
    product_id: {
      type: Number
    },
    questions_id: {
      type: Number
    },
    question_body: {
      type: String
    },
    question_date: {
      type: Date
    },
    asker_name: {
      type: String
    },
    question_helpfulness: {
      type: Number
    },
    question_reported: {
      type: Boolean
    },
})

 // answers
const answerSchema = new Schema({
  question_id: {
    type: Number
  },
  answer_id: {
    type: Number
  },
  answer_body: {
    type: String
  },
  answer_date: {
    type: Date
  },
  answerer_name: {
    type: String
  },
  answer_helpfulness: {
    type: Number
  },
  answer_reported: {
    type: Boolean
  },
})

// photos
const photoSchema = new Schema({
  answer_id: {
    type: Number
  },
  url: {
    type: String
  },
})
