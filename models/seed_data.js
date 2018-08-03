var express = require('express');
var router = express.Router();
var path = require('path');


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { FoodListings } = require('../models/foodlisting_model');
const { Contact } = require('../models/contact_model');

const c1 = new Contact({"nameFirst":"Cody", "nameLast":"Farmer", "phoneNumber":"619-555-1234","email":"cody@garden52.codyi.mobi","address":"Cody St. San Diego, Ca 92117"});
const listing1 = new FoodListings({
    "datePosted": undefined,
    "dateAvailable": "12-12-2018",
    "itemDescription": "5 Tomatoes, and 2 bell peppers",
    "quantity": "1",
    "pickupLocation": "My House",
    "selfPickup": "false",
    "curbsidePickup":"false",
    "comeToDoor": "true",
    "meetUpAtLocation": "false",
    "willDropOff": "false",
    "availableNow": "true",
    "listerContact": c1
});
const c2 = new Contact({"nameFirst":"Cody", "nameLast":"Gardener", "phoneNumber":"619-555-1234","email":"cody@garden52.codyi.mobi","address":"Cody St. San Diego, Ca 92117"});
const listing2 = new FoodListings({
    "datePosted": undefined,
    "dateAvailable": "11-12-2018",
    "itemDescription": "4 ears of corn",
    "quantity": "3",
    "pickupLocation": "Goodwill at Balboa and Clairemont Dr.",
    "selfPickup": "false",
    "curbsidePickup":"false",
    "comeToDoor": "false",
    "meetUpAtLocation": "true",
    "willDropOff": "true",
    "availableNow": "true",
    "listerContact": c2
});
const c3 = new Contact({"nameFirst":"Cody", "nameLast":"Cooker", "phoneNumber":"619-555-1234","email":"cody@garden52.codyi.mobi","address":"Cody St. San Diego, Ca 92117"});
const listing3 = new FoodListings({
    "datePosted": undefined,
    "dateAvailable": "12-12-2018",
    "itemDescription": "1 pint of cherry tomatoes",
    "quantity": "5",
    "pickupLocation": "My House",
    "selfPickup": "false",
    "curbsidePickup":"true",
    "comeToDoor": "false",
    "meetUpAtLocation": "false",
    "willDropOff": "false",
    "availableNow": "true",
    "listerContact": c3
});

const listingArray = [listing1,listing2,listing3];

FoodListings.insertMany(listingArray, err=> {
    console.log("Error inserting many: " + err);
});
