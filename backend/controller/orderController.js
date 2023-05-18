const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  if (order) {
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } else {
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (order) {
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  }
});

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json({
      success: true,
      order,
    });
  } else {
    return next(new ErrorHandler("Order not found"), 404);
  }
});

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (orders) {
    res.status(200).json({
      success: true,
      orders,
    });
  } else {
    return next(new ErrorHandler("Order not found"), 404);
  }
});

exports.getAllorder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  if (orders) {
    orders.forEach((i) => {
      totalAmount += i.totalPrice;
    });
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } else {
    return next(new ErrorHandler("Order not found"), 404);
  }
});

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found"), 404);
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order is already delivered"), 400);
  }
  console.log("order items---", order.orderItems);
  // if (order.orderStatus === "Shipped") {
  order.orderItems.forEach(
    async (i) => await updateStock(i.product, i.quantity)
  );
  // }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Order updated successfully",
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  product.save({ validateBeforeSave: false });
}
