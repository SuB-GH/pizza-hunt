// For this project, we've created the functionality in controllers and the endpoints in routes
// this file will handle the Pizza model updates, and contains the five main CRUD methods for the /api/pizzas endpoint routes
// Functionality: the functions below are "methods" of the pizzaController object. b/c these methods will be used as callback functions for the Express.js routes, each will take two parameters: req and res.

const { Pizza } = require('../models');

const pizzaController = {
    // this method will get all pizza data and will serve as the callback function for the GET /api/pizzas route. It uses the Mongoose .find() method
    // .populate shows the actual comment, not just the id. select with minus sign means we don't want "v" returned. sort method sorts in descending order by id value
    getAllPizza(req, res) {
        Pizza.find({})
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // this method ".getPizzaById()", uses the Mongoose .findOne() method to find a single pizza by its _id. Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled.
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // createPizza method
    // we've destructured the body out of the Express.js req object because we don't need to interface with any of the other data it provides
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    },

    // update pizza by id
    // this updates a pizza when we make a request to PUT /api/pizzas/:id. this finds the single document, updates it and returns the updated doc. {new: true} is what returns the new/updated doc, not the original
    // update pizza by id
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }

}

module.exports = pizzaController;