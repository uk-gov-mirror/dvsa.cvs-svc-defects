import {expect} from "chai";
import {DefectsDAO} from "../../src/models/DefectsDAO";
import sinon from "sinon";
const sandbox = sinon.createSandbox();
import AWS from "aws-sdk";

describe("DefectsDAO", () => {
    context("GeneratePartialParams", () => {
        it("should return a basic object with the right table name", () => {
            const dao = new DefectsDAO();
            const partial = dao.generatePartialParams();
            expect(partial).to.deep.equal({RequestItems: {[`cvs-${process.env.BRANCH}-defects`]: []}});
        });
    });

    context("createMultiple", () => {
        beforeEach(() => {jest.resetModules(); });
        afterEach(() => sandbox.restore());
        it("correctly processes an array of inputs",  async () => {
            mockDocumentClientWithReturn("Success");
            const dao = new DefectsDAO();
            const output = await dao.createMultiple([{input: "something"}]);
            expect(output).to.equal("Success");
        });
    });

    context("deleteMultiple", () => {
        beforeEach(() => {jest.resetModules(); });
        afterEach(() => sandbox.restore());
        it("correctly processes an array of inputs",  async () => {
            mockDocumentClientWithReturn("Success");
            const dao = new DefectsDAO();
            const output = await dao.deleteMultiple(["something"]);
            expect(output).to.equal("Success");
        });
    });
});

function mockDocumentClientWithReturn(retVal: any) {
    sandbox.replace(AWS.DynamoDB.DocumentClient.prototype, "batchWrite", sinon.stub().callsFake(() => {
        return {
            promise: sinon.fake.resolves(retVal)
        };
    }));
}
