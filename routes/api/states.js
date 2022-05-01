const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");

router.route("/").get(statesController.getAllStates);

router
  .route("/:state/funfact")
  .get(statesController.getAllStates)
  .post(statesController.createNewEmployee)
  .patch(statesController.updateEmployee)
  .delete(statesController.deleteEmployee);

router.route("/:state").get(statesController.getState);

router.route("/:state/capital").get(statesController.getStateCapital);
router.route("/:state/nickname").get(statesController.getStateNickname);
router.route("/:state/population").get(statesController.getStatePopulation);
router.route("/:state/admission").get(statesController.getStateAdmission);

module.exports = router;
