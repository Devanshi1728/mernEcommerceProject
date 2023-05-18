const express = require("express");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const {
  createOrder,
  myOrders,
  getSingleOrder,
  getAllorder,
  updateOrder,
  deleteOrder,
} = require("../controller/orderController");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, createOrder);
router.route("/order/me").get(isAuthenticatedUser, myOrders);
router
  .route("/admin/order")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllorder);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleOrder);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

module.exports = router;
