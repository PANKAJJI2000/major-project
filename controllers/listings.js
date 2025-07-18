const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    try {
        const { search } = req.query;
        let allListings;
        
        if (search) {
            allListings = await Listing.find({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } },
                    { country: { $regex: search, $options: "i" } }
                ]
            });
        } else {
            allListings = await Listing.find({});
        }
        
        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error loading listings");
        res.redirect("/listings");
    }
};

 module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
  };
  module.exports.showListing = async (req,res) =>{
    let {id} =req.params;
    const listing= await Listing.findById(id)
    .populate({path: "reviews", 
     populate:{
       path: "author",
    },
   })
    .populate("owner");
    if(!listing) {
     req.flash("success", "Listing you requested for does not exist");
     res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing});
};
module.exports.createListing= async (req, res, next) => {
    let url= req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image= {url, filename};
    await newListing.save();
    req.flash("success", "New listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("success", "Listing you requested for does not exist");
      res.redirect("/listings")
     }
     let originalImageUrl = listing.image.url;
     originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  };

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);  // Fetch the existing listing from DB
  if (!listing) {
      req.flash("success", "Listing you requested for does not exist");
      return res.redirect("/listings");
  }

  // Update the listing with the new data
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // If a new image is uploaded, update the listing image
  if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();  // Save the updated listing
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing= async (req,res) =>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "New listing Deleted");
    res.redirect("/listings");
  };