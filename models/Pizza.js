const { Schema, model } = require('mongoose');  // this imports the Schema constructor, and model function from the mongoose library
const dateFormat = require('../utils/dateFormat');

// this creates the schema for the model. trim removes white space before and after the input string.
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    // added validation to the size. "enum" refers to a set of data that can be iterated over
    size: {
      type: String,
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
  // reduce tallies up the total of comments and its replies
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;