const { Schema, model } = require('mongoose');  // this imports the Schema constructor, and model function from the mongoose library
const dateFormat = require('../utils/dateFormat');

// this creates the schema for the model
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: [],
    // the "parent" Pizza, is associated with "child" comment here. ref tells it to search the Comment document
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    // this "toJSON" tells the schema that it can use virtuals and getters
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get total count of comments and replies on retrieval. Virtuals allow us to add more information to a database response so that we don't have to add in the information manually with a helper before responding to the API request
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;