const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  if (product) {
    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
});

exports.updateProduct = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (product) {
    res.status(200).json({
      success: true,
      product,
      message: "Product updated successfully",
    });
  } else {
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

exports.getAllProducts = catchAsyncError(async (req, res) => {
  const productPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(productPerPage);
  const product = await apiFeature.query;

  if (product) {
    res.status(200).json({ productCount, success: true, product });
  } else {
    return next(new ErrorHandler("Product not found", 404));
    // res.status(400).json({ success: false, message: "Product not found" });
  }
});

exports.deleteProduct = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
    // res.status(400).json({ success: false, message: "Product not found" });
  } else {
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  }
});

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
    // res.status(400).json({ success: false, message: "Product not found" });
  } else {
    res.status(200).json({ success: true, product });
  }
});

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const reviewData = {
    rating: Number(rating),
    comment,
    user: req.user._id,
    name: req.user.name,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (i) => i.user.toString() === req.user._id
  );
  if (isReviewed) {
    product.reviews.forEach((i) => {
      if (i.user.toString() === req.user._id) {
        (i.rating = rating), (i.comment = comment);
      }
    });
  } else {
    product.reviews.push(reviewData);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.ratings = product.reviews.forEach((i) => {
    avg += i.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Review added successfully",
  });
});

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  console.log(req.query);
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteProductReviews = catchAsyncError(async (req, res, next) => {
  console.log(req.query);
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (i) => i._id.toString() !== req.query.reviewId.toString()
  );
  let avg = 0;
  reviews.forEach((i) => {
    avg += i.rating;
  });
  ratings = avg / product.reviews.length;
  numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
