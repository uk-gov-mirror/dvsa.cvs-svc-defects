import { DefectsService } from "../../src/services/DefectsService";
import { expect } from "chai";
import { HTTPError } from "../../src/models/HTTPError";



describe("when calling service method getDefectList", () => {
    describe("when database is on", () => {
        context("when defectsDAO getAll resolves promise with data", () => {
            it("should return a defect item", () => {
                const expectedDefects = {
                    Items: [{ imNumber: "1" }]
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        getAll: () => {
                            return Promise.resolve(expectedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const service: DefectsService = new DefectsService(mockDefectsDAO);
                service.getDefectList()
                    .then((returnedRecords) => {
                        expect(returnedRecords).to.not.equal(undefined);
                        expect(returnedRecords).to.not.equal({});
                        expect(returnedRecords).to.eql(expectedDefects);
                        expect(returnedRecords.length).to.be.equal(expectedDefects.Items.length);
                    });
            });
        });

        context("when defectsDAO getAll resolves promise with empty data", () => {
            it("should return HTTP Error Code 404-No resources match the search criteria", () => {
                const expectedDefects = {
                    Items: [],
                    Count: 0
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        getAll: () => {
                            return Promise.resolve(expectedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                defectsService.getDefectList()
                    .then(() => {
                        expect.fail();
                    }).catch((errorResponse) => {
                        expect(errorResponse).to.be.instanceOf(HTTPError);
                        expect(errorResponse.statusCode).to.equal(404);
                        expect(errorResponse.body).to.equal("No resources match the search criteria.");
                    });
            });
        });

        context("when defectsDAO getAll resolves promise with undefined data", () => {
            it("should return 404-No resources match the search criteria", () => {
                const expectedDefects = {
                    Items: undefined,
                    Count: 0
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        getAll: () => {
                            return Promise.resolve(expectedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                defectsService.getDefectList()
                    .then(() => {
                        expect.fail();
                    }).catch((errorResponse) => {
                        expect(errorResponse).to.be.instanceOf(HTTPError);
                        expect(errorResponse.statusCode).to.equal(404);
                        expect(errorResponse.body).to.equal("No resources match the search criteria.");
                    });
            });
        });
    });

    describe("when database is off", () => {
        context("when defectsDAO returns a rejected promise", () => {
            it("should return 500-Internal Server Error", () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        getAll: () => {
                            return Promise.reject({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const service: DefectsService = new DefectsService(mockDefectsDAO);
                service.getDefectList()
                    .then(() => {
                        expect.fail();
                    })
                    .catch((errorResponse: HTTPError) => {
                        expect(errorResponse).to.be.instanceOf(HTTPError);
                        expect(errorResponse.statusCode).to.be.equal(500);
                        expect(errorResponse.body).to.equal("Internal Server Error");
                    });
            });
        });
    });
});
