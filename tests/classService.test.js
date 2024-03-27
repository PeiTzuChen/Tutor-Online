const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const { postClass } = require("../services/classServices");
const { Class } = require("../models");

let sandbox = sinon.createSandbox();
const req = {
  body: {
    name: "Math",
    dateTimeRange: "2024-04-01 20:00-21:00",
    category: "1",
  },
  user: {
    studentId: 1,
    teacherId: 2,
  },
};

describe("postClass", function () {
  afterEach(() => {
    sandbox.restore();
  });
  
  it("create a class without conflicts", function (done) {
    const WithoutOverlap = [
      {
        dateTimeRange: "2024-04-01 19:00-20:00",
      },
      {
        dateTimeRange: "2024-04-01 21:00-21:30",
      },
    ];

    sandbox.stub(Class, "findAll").resolves(WithoutOverlap);
    sandbox
      .stub(Class, "create")
      .resolves({
        toJSON: () => ({
          id: 1,
          name: "Math",
          dateTimeRange: "2024-04-01 20:00-21:00",
        }),
      });

    postClass(req, {}, (err, result) => {
      if (err) return done(err);

      expect(result.name).to.equal("Math");
      expect(result.dateTimeRange).to.equal("2024-04-01 20:00-21:00");
      expect(Class.create.calledOnce).to.be.true;

      done();
    });
  });

  it("have conflicts with booking class as student", function (done) {
      const studentOverlap = [
        {
          dateTimeRange: "2024-04-01 20:00-20:30",
        },
      ];
      sandbox.stub(Class, "findAll").resolves(studentOverlap);
          postClass(req, {}, (err, result) => {
            expect(err.status).to.equal(400);
            expect(err.message).to.equal(
              "This class conflicts with other class you booked as student"
            );
            done();
          });
  });
});