const { Schema, model } = require('mongoose');  // this imports the Schema constructor, and model function from the mongoose library

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
        // this "toJSON" tells the schema that it can use virtuals 
      toJSON: {
        virtuals: true,
      },
      id: false
    }
  );

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
  });

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;