const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

const { PhoneBook } = require("../models");
const { Op } = require("sequelize");
const app = require("../app");

describe("phonebooks", () => {
  after((done) => {
    PhoneBook.destroy({
      where: {
        name: { [Op.substring]: "#TESTING#" },
      },
    }).then(() => {
      done();
    });
  });

  it("Should get all phonebooks with 'GET' method", (done) => {
    chai
      .request(app)
      .get("/api/phonebooks")
      .end((err, res) => {
        if (err) throw new Error("Failed while testing phonebooks");
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.phonebooks.should.be.a("array");
        res.body.phonebooks[res.body.phonebooks.length - 1].should.be.a(
          "object"
        );
        res.body.phonebooks[
          res.body.phonebooks.length - 1
        ].should.have.property("id");
        res.body.phonebooks[
          res.body.phonebooks.length - 1
        ].should.have.property("name");
        res.body.phonebooks[
          res.body.phonebooks.length - 1
        ].should.have.property("phone");
        res.body.phonebooks[
          res.body.phonebooks.length - 1
        ].should.have.property("avatar");
        res.body.phonebooks[
          res.body.phonebooks.length - 1
        ].should.have.property("createdAt");
        res.body.phonebooks[
          res.body.phonebooks.length - 1
        ].should.have.property("updatedAt");
        res.body.phonebooks[res.body.phonebooks.length - 1].id.should.be.a(
          "number"
        );
        res.body.phonebooks[res.body.phonebooks.length - 1].name.should.be.a(
          "string"
        );
        res.body.phonebooks[res.body.phonebooks.length - 1].phone.should.be.a(
          "string"
        );
        res.body.phonebooks[
          res.body.phonebooks.length - 1
        ].createdAt.should.be.a("string");
        res.body.phonebooks[
          res.body.phonebooks.length - 1
        ].updatedAt.should.be.a("string");
        done();
      });
  });

  it("Should create phonebooks with 'POST' method", (done) => {
    chai
      .request(app)
      .post("/api/phonebooks")
      .send({ name: "#TESTING# POST", phone: "0812354321" })
      .end((err, res) => {
        if (err) throw new Error("Failed while testing phonebooks");
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.id.should.be.a("number");
        res.body.name.should.be.a("string");
        res.body.phone.should.be.a("string");
        res.body.createdAt.should.be.a("string");
        res.body.updatedAt.should.be.a("string");
        res.body.name.should.equal("#TESTING# POST");
        res.body.phone.should.equal("0812354321");
        done();
      });
  });

  it("Should edit phonebooks with 'PUT' method", (done) => {
    chai
      .request(app)
      .get("/api/phonebooks?keyword=0812354321")
      .end((error, response) => {
        if (error) throw new Error("Failed while testing phonebooks");
        chai
          .request(app)
          .put(
            `/api/phonebooks/${
              response.body.phonebooks[response.body.phonebooks.length - 1].id
            }`
          )
          .send({
            name: "#TESTING# PUT",
            phone: "08321321321",
          })
          .end((err, res) => {
            if (err) throw new Error("Failed while testing phonebooks");
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.id.should.be.a("number");
            res.body.name.should.be.a("string");
            res.body.phone.should.be.a("string");
            res.body.createdAt.should.be.a("string");
            res.body.updatedAt.should.be.a("string");
            res.body.name.should.equal("#TESTING# PUT");
            res.body.phone.should.equal("08321321321");
            done();
          });
      });
  });

  it("Should update avatar phonebooks with 'PUT' method", (done) => {
    chai
      .request(app)
      .get("/api/phonebooks?keyword=08321321321")
      .end((error, response) => {
        if (error) throw new Error("Failed while testing phonebooks");
        chai
          .request(app)
          .put(
            `/api/phonebooks/${
              response.body.phonebooks[response.body.phonebooks.length - 1].id
            }/avatar`
          )
          .send({ avatar: "picture.jpg" })
          .end((err, res) => {
            if (err) throw new Error("Failed while testing phonebooks");
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.id.should.be.a("number");
            res.body.name.should.be.a("string");
            res.body.phone.should.be.a("string");
            res.body.avatar.should.be.a("string");
            res.body.createdAt.should.be.a("string");
            res.body.updatedAt.should.be.a("string");
            res.body.name.should.equal("#TESTING# PUT");
            res.body.phone.should.equal("08321321321");
            done();
          });
      });
  });

  it("Should delete phonebooks with 'DELETE' method", (done) => {
    chai
      .request(app)
      .get("/api/phonebooks?keyword=08321321321")
      .end((error, response) => {
        if (error) throw new Error("Failed while testing phonebooks");
        chai
          .request(app)
          .delete(
            `/api/phonebooks/${
              response.body.phonebooks[response.body.phonebooks.length - 1].id
            }`
          )
          .end((err, res) => {
            if (err) throw new Error("Failed while testing phonebooks");
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("number");
            res.body.should.equal(1);
            done();
          });
      });
  });
});
