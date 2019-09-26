import { DefectsDAO } from "../../src/models/DefectsDAO";
import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

describe("DefectsDAO", () => {
    beforeEach(() => {
        jest.resetModules();
        AWS.DynamoDB.DocumentClient.prototype.batchWrite = jest.fn().mockImplementation((params: DocumentClient.BatchWriteItemInput) => {
            return {
                promise: () => Promise.resolve("success")
            };
        });
    });

    context("GeneratePartialParams", () => {
        it("should return a basic object with the right table name", () => {
            const dao = new DefectsDAO();
            const partial = dao.generatePartialParams();
            expect(partial).toEqual({ RequestItems: { [`cvs-${process.env.BRANCH}-defects`]: [] } });
        });
    });

    context("createMultiple", () => {
        it("correctly processes an array of inputs", async () => {
            const dao = new DefectsDAO();
            const output = await dao.createMultiple([{ input: "something" }]);
            expect(output).toEqual("success");
        });
    });

    context("deleteMultiple", () => {
        it("correctly processes an array of inputs", async () => {
            const dao = new DefectsDAO();
            const output = await dao.deleteMultiple(["something"]);
            expect(output).toEqual("success");
        });
    });
});
