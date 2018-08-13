var express = require("express");
var router = express.Router();
var path = require("path");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { FoodListings } = require("../models/foodlisting_model");

const { Contact } = require("../models/contact_model");

//!Remove THIS
router.get("/foodlistings/", function(req, res) {
  FoodListings.find({})
    .then(foodListings => {
      res.status(200).json(foodListings);
    })
    .catch(error => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

//add new notification to bed
router.post("/foodlistings/", jsonParser, (req, res) => {
  const requiredFields = [
    "datePosted",
    "dateAvailable",
    "dateExpires",
    "itemDescription",
    "quantity",
    "pickupLocation",
    "selfPickup",
    "curbsidePickup",
    "comeToDoor",
    "meetUpAtLocation",
    "willDropOff",
    "availableNow"
  ];
  console.log("REQ BODY: " + JSON.stringify(req.body));
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      //console.error(message);
      return res.status(400).send(message);
    }
  }

  const listerContact = new Contact({
    nameFirst: req.body.listerContact.nameFirst,
    nameLast: req.body.listerContact.nameLast,
    phoneNumber: req.body.listerContact.phoneNumber,
    email: req.body.listerContact.email,
    address: req.body.listerContact.address
  });

  const newListing = new FoodListings({
    datePosted: req.body.datePosted,
    dateAvailable: req.body.dateAvailable,
    dateExpires: req.body.dateExpires,
    itemDescription: req.body.itemDescription,
    quantity: req.body.quantity,
    pickupLocation: req.body.pickupLocation,
    selfPickup: req.body.selfPickup,
    curbsidePickup: req.body.curbsidePickup,
    comeToDoor: req.body.comeToDoor,
    meetUpAtLocation: req.body.meetUpAtLocation,
    willDropOff: req.body.willDropOff,
    availableNow: req.body.availableNow,
    listerContact: listerContact
  });
  console.log(`Adding foodlisting \`${JSON.stringify(req.body)}\``);
  FoodListings.insertMany(newListing, { returnOriginal: false }, function(
    error,
    success
  ) {
    if (error) {
      //console.log("ERROR: " + error);
      res.status(201).json(error);
    } else if (success) {
      //console.log("SUCCESS: " + success);
      res.status(201).json(success);
    } else {
      res.status(201).json(success);
    }
  });
});

//delete notification from bed
router.delete("/foodlistings/:id", jsonParser, (req, res) => {
  FoodListings.findByIdAndRemove(
    req.params.id,
    //FoodListings.update({"_id":req.params.id},{ $pull:{"_id":req.params.id}},
    function(error, success) {
      if (error) {
        console.log("ERROR: " + error);
        res.status(400).json(error);
      } else if (success) {
        console.log("SUCCESS: " + JSON.stringify(success));
        return res.status(200).send("Success");
      } else {
        console.log("Record Not Found");
        return res.status(400).send("Record not found");
      }
    }
  );
});

function intersect(a, b) {
  var t;
  if (b.length > a.length) (t = b), (b = a), (a = t); // indexOf to loop over shorter
  return a.filter(function(e) {
    return b.indexOf(e) > -1;
  });
}

module.exports = router;
