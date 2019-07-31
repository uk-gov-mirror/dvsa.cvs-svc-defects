import { DefectsService } from "../../src/services/DefectsService";
import { expect } from "chai";
import { HTTPError } from "../../src/models/HTTPError";

describe("when service method insertDefectList is called", () => {
    describe("when database is off", () => {
        context("when defectsDAO createMultiple returns a rejected promise", () => {
            it("should return 500-Internal Server Error", () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        createMultiple: () => {
                            return Promise.reject({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const service: DefectsService = new DefectsService(mockDefectsDAO);
                service.insertDefectList([])
                    .catch((errorResponse: HTTPError) => {
                        expect(errorResponse).to.be.instanceOf(HTTPError);
                        expect(errorResponse.statusCode).to.be.equal(500);
                        expect(errorResponse.body).to.equal("Internal Server Error");
                    });
            });
        });
    });

    describe("when database is on", () => {
        context("when defectsDAO createMultiple yields promise with unprocessed defect items", () => {
            it("should return HTTP 200 along with unprocessed items", () => {
                const expectedUnprocessedDefects = {
                    UnprocessedItems: [{ imNumber: "1" }],
                    Count: 1
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        createMultiple: () => {
                            return Promise.resolve(expectedUnprocessedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                defectsService.insertDefectList(["1"])
                    .then((result: any) => {
                        expect(Object.keys(result).length).to.equal(1);
                        expect(result.constructor).to.equal(Object);
                    });
            });
        });


        context("when defectsDAO createMultiple yields promise with no unprocessed defect items", () => {
            it("should return HTTP 200", () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        createMultiple: () => {
                            return Promise.resolve({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                defectsService.insertDefectList(["1"])
                    .then((returnedRecords: any) => {
                        expect(returnedRecords).to.equal(undefined);
                    });
            });
        });
    });
});
