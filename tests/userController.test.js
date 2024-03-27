const request = require("supertest");
const chai = require("chai");
const should = chai.should();

const app = require("../app")

describe("登入測試: POST /signin", function () {
 
  it("#1 密碼錯誤", function (done) {
    request(app)
      .post("/signin")
      .type("application/json") // 跟 set()一樣
      .send({
        email: "root@example.com",
        password:"123"
      })
      .end((err, res) => {
        res.statusCode.should.equal(401);
        done();
      });
  });

  it("#2 帳號錯誤", function (done) {
    request(app)
      .post("/signin")
      .type("application/json")
      .send({
        email: "test@test",
        password: "12345678",
      })
      .end((err, res) => {
        res.statusCode.should.equal(401)
        done();
      });
  });

  it("#3 成功登入", function (done) {
    request(app)
      .post("/signin")
      .type("application/json")
      .send({
        email: "root@example.com",
        password: "12345678",
      })
      .end((err, res) => {
        res.statusCode.should.equal(200), 
        res.body.user.isAdmin.should.equal(true)
        done();
      });
  });
});
