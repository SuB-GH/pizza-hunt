const { Comment, Pizza } = require('../models');

// this is a commentController object, containing two methods for adding and removing comments
const commentController = {
    // add comment to pizza. the $push method (adds data to an array) and allows us to add the comment's _id to the specific pizza we want to update. (MongoDB-based functions start with $ to make them stand out)
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
          { _id: params.commentId },
          { $push: { replies: body } },
          { new: true, runValidators: true }
        )
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },

      // remove reply
removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
// $pull operator removes the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err));
  },

    // remove comment. first we delete the comment (while also returning it's data), then we'll use its _id to remove it from the pizza using $pull 
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }
};
module.exports = commentController;