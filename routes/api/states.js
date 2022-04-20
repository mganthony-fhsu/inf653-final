const express = require("express");
const router = express.Router();
const statesController = require('../../controllers/statesController')


router.route('/')
    .get(statesController.getAllEmployees)
    .post(statesController.createNewEmployee)
    .put(statesController.updateEmployee)
    .delete(statesController.deleteEmployee)

router.route('/:state')
    .get(statesController.getEmployee);



module.exports = router;