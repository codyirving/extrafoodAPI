"use strict";
const { Contact } = require("./contact_model");
const mongoose = require("mongoose");

const foodListingSchema = mongoose.Schema({
  datePosted: { type: Date, required: true, default: Date.now },
  dateAvailable: { type: Date },
  dateExpires: { type: Date },
  claimed: { type: Boolean, default: false },
  claimedDate: { type: Date },
  itemDescription: { type: String, required: true },
  quantity: { type: Number },
  pickupLocation: { type: String },
  selfPickup: { type: Boolean, default: false },
  curbsidePickup: { type: Boolean, default: false },
  comeToDoor: { type: Boolean, default: false },
  meetUpAtLocation: { type: Boolean, default: false },
  willDropOff: { type: Boolean, default: false },
  availableNow: { type: Boolean, default: false },
  photoURL: { type: String },
  listerContact: Contact.prototype.schema
});

const FoodListings = mongoose.model("FoodListings", foodListingSchema);

module.exports = { FoodListings };
