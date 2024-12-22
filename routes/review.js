const express= require("express");
const router=express.Router({mergeParams:true});
const ExpressError= require("../utils/ExpressError.js");
const wrapAsync= require("../utils/wrapAsync.js");
const Review =require("../models/review.js");
const Listing =require("../models/listing.js");
const {validateReview, 
       isLoggedIn, 
       isReviewAuthor} = require("../middleware.js");
const reviewController =require("../controllers/reviews.js")


// REVIEW post route
router.post("/",isLoggedIn, validateReview, 
       wrapAsync(reviewController.createReview));

// delete route 
// Add ':id' and ':reviewId' to the route path
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, 
       wrapAsync(reviewController.destroyReview));

module.exports=router;