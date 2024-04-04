const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const { getStudents } = require("../services/studentServices");
const { Student } = require("../models");

let sandbox = sinon.createSandbox();

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
    // sinon.assert.calledWith(cb, null, 'doesn\'t have students data yet')
    expect(cb.calledWith(null, 'doesn\'t have students data yet')).to.be.true;
 });

it("should return an error if an error occurs", async () => {
  //可以用it.only單獨測試
  const expectedError = new Error("Database error")
  sandbox.stub(Student, "findAll").rejects(expectedError)
  const cb = sandbox.stub();
  await getStudents({}, cb);
  
  // sinon.assert.calledWith(cb, expectedError);
  expect(
      cb.calledWith(
        sinon.match
          .instanceOf(Error)
          .and(sinon.match.has("message", "Database error"))
      )
    ).to.be.true;
})
})