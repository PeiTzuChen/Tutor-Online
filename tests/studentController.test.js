const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const { getStudents } = require("../services/studentServices");
const setupNewUser = require("../services/tutorialServices");
const { Student } = require("../models");

let sandbox = sinon.createSandbox();


describe('tutorial',()=>{

  it("should pass the error into the callback if save fails", function () {
    var expectedError = new Error("oops");
    var save = sinon.stub(Student, "findOne")
    save.throws(expectedError);
    var callback = sinon.spy();

    setupNewUser({ name: "foo" }, callback);

    sinon.assert.calledWith(callback, expectedError);
    save.restore()
  });

})


describe('getStudents', () => {

afterEach(() => {
  sandbox.restore();
});

 it('should return students data if available', async () => {

    sandbox.stub(Student, "findAll").resolves([
      { id: 1, name: "John Doe", totalLearningTime: 100 },
      { id: 2, name: "Jane Doe", totalLearningTime: 200 },
    ]);

    const cb = sandbox.stub();
    await getStudents({}, cb);

    expect(cb.calledWith(null, [
      { id: 1, name: 'John Doe', totalLearningTime: 100 },
      { id: 2, name: 'Jane Doe', totalLearningTime: 200 },
    ])).to.be.true;
    
 });

 it('should return a message if no students data is available', async () => {

    sandbox.stub(Student, "findAll").resolves([]);
    const cb = sandbox.stub();

    await getStudents({}, cb);
    sinon.assert.calledWith(cb, null, 'doesn\'t have students data yet')
    expect(cb.calledWith(null, 'doesn\'t have students data yet')).to.be.true;
 });

it("should return an error if an error occurs", async () => {
  
  const expectedError = new Error("Database error")
  sandbox.stub(Student, "findAll").rejects(expectedError)
  const cb = sandbox.stub()
  await getStudents({}, cb);

    //A
    sinon.assert.calledWith(
      cb,
      sinon.match({
        err: sinon.match
          .instanceOf(Error)
          .and(sinon.match.has("message", "Database error")),
      })
    );
    //B
    // expect(cb.calledWith(expectedError)).to.be.true;


// 第一種
// expect(cb.calledWith(sinon.match.instanceOf (Error) )).to.be.true;
// 第二種
// expect(cb.firstCall.args[0]).to.be.instanceOf(Error);
// expect(cb.firstCall.args[0].message).to.equal("Database error");

// 第三種
// expect(
//   cb.calledWithMatch(
//     sinon.match(
//       value => value instanceof Error && value.message === "Database error"
//     )
//   )).to.be.true;

// 第四種
// expect(
//   cb.calledWithMatch(
//     sinon.match
//       .instanceOf(Error)
//       .and(sinon.match.has("message", "Database error"))
//   )
// ).to.be.true;
//  })
})
})