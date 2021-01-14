const { Ingredients } = require('../models/ingredients');

exports.getIng = async(req, res) => {
    const ingredients = await Ingredients.find();
    return res.send(ingredients);
}

exports.postIng = async(req, res) => {
    const ingredients = new Ingredients({
        title: req.body.title,
        amount: req.body.amount
    });
    const ing_ = await ingredients.save();
    return res.send(ing_);
}