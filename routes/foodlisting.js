var express = require("express");
var router = express.Router();
var path = require("path");
var nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { EMAIL_LOGIN, EMAIL_PW } = require("../config");
const { FoodListings } = require("../models/foodlisting_model");

const { Contact } = require("../models/contact_model");

function sendSuccessEmails(email, response) {
  console.log("Email: " + EMAIL_LOGIN + " pw " + EMAIL_PW + " TO " + email);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${EMAIL_LOGIN}`,
      pass: `${EMAIL_PW}`
    }
  });
  let details = `Self Pickup: ${response.selfPickup ? "Yes" : "No"}
  Item Description: ${response.itemDescription}
  Extra Notes: ${response.listerExtraNotes}
  Date Available: ${response.dateAvailable}`;
  var mailOptions = {
    from: `${EMAIL_LOGIN}`,
    to: `${email}`,
    subject: "Claimed!",
    text: `You claimed it: \n${details}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

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

//add new foodlisting
router.post("/foodlistings/", jsonParser, (req, res) => {
  const requiredFields = [
    "dateAvailable",
    "dateExpires",
    "userEmail",
    "itemDescription",
    "selfPickup",
    "curbsidePickup",
    "comeToDoor",
    "meetUpAtLocation",
    "willDropOff"
  ];
  console.log("REQ BODY: " + JSON.stringify(req.body));

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  // console.log("listerContact ");
  // const listerContact = new Contact({
  //   nameFirst: req.body.listerContact.nameFirst,
  //   nameLast: req.body.listerContact.nameLast,
  //   phoneNumber: req.body.listerContact.phoneNumber,
  //   email: req.body.listerContact.email,
  //   address: req.body.listerContact.address
  // });
  // console.log("foodlistings ");
  // const newListing = new FoodListings({
  //   datePosted: req.body.datePosted,
  //   dateAvailable: req.body.dateAvailable,
  //   dateExpires: req.body.dateExpires,
  //   claimed: req.body.claimed,
  //   claimedDate: req.body.claimDate,
  //   itemDescription: req.body.itemDescription,
  //   quantity: req.body.quantity,
  //   pickupLocation: req.body.pickupLocation,
  //   selfPickup: req.body.selfPickup,
  //   curbsidePickup: req.body.curbsidePickup,
  //   comeToDoor: req.body.comeToDoor,
  //   meetUpAtLocation: req.body.meetUpAtLocation,
  //   willDropOff: req.body.willDropOff,
  //   availableNow: req.body.availableNow,
  //   listerContact: listerContact
  // });
  console.log(`Adding foodlisting \`${JSON.stringify(req.body)}\``);
  FoodListings.insertMany(req.body, { returnOriginal: false }, function(
    error,
    success
  ) {
    if (error) {
      //console.log("ERROR: " + error);
      res.status(201).json(error);
    } else if (success) {
      console.log("SUCCESS: " + success);
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

/* POST update to notification details */
router.post("/foodlistings/claim/", jsonParser, (req, res) => {
  let found = false;

  const requiredFields = ["_id", "claimedDate", "claimed", "email"];

  console.log("req.body.keys: " + Object.keys(req.body));
  //check req.body for any of required keys
  const intersected = intersect(requiredFields, Object.keys(req.body));

  //console.log("Intersected: " + intersected);

  //MONGODB $set object
  let jsonSetObject = {};
  for (let i = 0; i < intersected.length; i++) {
    const field = intersected[i];
    //look for passed field to update
    //console.log("if " + field + " in " + req.body);
    if (field in req.body) {
      //found at least one
      found = true;
      const setString = field;
      //set the key value
      jsonSetObject[setString] = req.body[field];

      //console.log("JSONSETobject: " + JSON.stringify(jsonSetObject));
    }
  }
  if (!found) {
    //none!
    const message = `Missing \`${requiredFields}\` in request body`;
    //console.error(message);
    return res.status(400).send(message);
  } else {
    let jsonSetObjectCopy = Object.assign({}, jsonSetObject);

    setTimeout(() => {
      console.log("timeout succeeded: deleting");
      jsonSetObjectCopy["claimed"] = false;
      console.log("jsonsetobjectCopy: " + JSON.stringify(jsonSetObjectCopy));
      console.log("timeout succeeded: deleting2");
      FoodListings.findOneAndUpdate(
        { _id: req.body._id },
        { $set: jsonSetObjectCopy },
        { returnNewDocument: true }
      ).then(success => console.log("Claim expiring...update:" + success));
    }, 60 * 1000 * 2); //auto expire claim in 2minutes for testing

    console.log("setObject:" + JSON.stringify(jsonSetObject));
  }

  FoodListings.findOneAndUpdate(
    { _id: req.body._id },
    { $set: jsonSetObject },
    { returnNewDocument: true }
  )
    .then(success => {
      if (success) {
        sendSuccessEmails(jsonSetObject.email, success);
        return res.status(201).json(success);
      } else {
        //console.log("failed " + success);
        return res.status(200).json(error);
      }
    })
    .catch(error => {
      if (error) {
        //console.log("ERROR: " + error);
        return res.status(200).json(error);
      }
      console.error("Error: " + error);
      res.status(500).json({ message: "Internal server error" });
    });
});

function intersect(a, b) {
  var t;
  if (b.length > a.length) (t = b), (b = a), (a = t); // indexOf to loop over shorter
  return a.filter(function(e) {
    return b.indexOf(e) > -1;
  });
}

module.exports = router;
