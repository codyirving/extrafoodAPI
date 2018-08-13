"use strict";
const { TEST_DATABASE_URL, PORT } = require("../config");
const { app, closeServer, runServer } = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

const config = require("../config");
chai.use(chaiHttp);
//db seed data
const seedData = require("../models/seed_data");

describe("test endpoints", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedData;
  });

  after(function() {
    return closeServer();
  });

  describe("getFoodListings", function() {
    it("should list all food listings on GET", function() {
      return chai
        .request(app)
        .get("/foodlistings")
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.be.above(0);
          res.body.forEach(position => {
            expect(position).to.have.all.keys(
              "_id",
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
              "availableNow",
              "listerContact",
              "__v"
            );
          });
        });
    });
  });
});
