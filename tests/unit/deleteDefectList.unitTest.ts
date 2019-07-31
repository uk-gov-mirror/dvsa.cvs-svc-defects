import { DefectsService } from "../../src/services/DefectsService";
import { expect } from "chai";
import { HTTPError } from "../../src/models/HTTPError";

describe("when service method deleteDefectList is called", () => {
    describe("when database is off", () => {
        context("when defectsDAO deleteMultiple returns a rejected promise", () => {
            it("should return 500-Internal Server Error", () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        deleteMultiple: () => {
                            return Promise.reject({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);

                return defectsService.deleteDefectList([])
                    .catch((errorResponse) => {
                        expect(errorResponse).to.be.instanceOf(HTTPError);
                        expect(errorResponse.statusCode).to.be.equal(500);
                        expect(errorResponse.body).to.equal("Internal ServerError");
                    });
            });
        });
    });

    describe("when database is on", () => {
        context("when defectsDAO deleteMultiple yields promise with unprocessed defect items", () => {
            it("should return 200 along with unprocessed items", () => {
                const expectedUnprocessedDefects = {
                    UnprocessedItems: [{ imNumber: "1" }],
                    Count: 1
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        deleteMultiple: () => {
                            return Promise.resolve(expectedUnprocessedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                return defectsService.deleteDefectList(["1"])
                    .then((returnedRecords: any) => {
                        expect(Object.keys(returnedRecords).length).to.equal(1);
                        expect(returnedRecords.constructor).to.equal(Array);
                        expect(returnedRecords).to.not.equal(undefined);
                        expect(returnedRecords).to.not.equal({});
                        expect(returnedRecords).to.deep.equal(expectedUnprocessedDefects.UnprocessedItems);
                        expect(returnedRecords.length).to.be.equal(expectedUnprocessedDefects.UnprocessedItems.length);
                    });
            });
        });

        context("when defectsDAO deleteMultiple yields promise with no unprocessed defect items", () => {
            it("should return HTTP 200", () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        deleteMultiple: () => {
                            return Promise.resolve({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                defectsService.deleteDefectList(["1"])
                    .then((returnedRecords: any) => {
                        expect(returnedRecords).to.equal(undefined);
                    });
            });
        });
    });
});
