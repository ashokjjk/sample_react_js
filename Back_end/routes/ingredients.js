const express = require('express');
const ingredientsController = require('../controllers/ingredients');


const router = express.Router();

//STORE
router.get('/ingredients', ingredientsController.getIng);
router.post('/ingredients', ingredientsController.postIng);



module.exports = router;