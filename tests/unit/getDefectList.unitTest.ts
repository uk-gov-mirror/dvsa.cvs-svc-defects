import { DefectsService } from "../../src/services/DefectsService";
import { Injector } from "../../src/models/injector/Injector";
import { DefectsDAOMock } from "../models/DefectsDAOMock";
import { expect } from "chai";
import { HTTPError } from "../../src/models/HTTPError";



describe('getDefectList', () => {
    describe("when database is on", () => {
        context('when db call returns data', () => {
            it('should return a populated response', () => {
                const defectsService: DefectsService = Injector.resolve<DefectsService>(DefectsService, [DefectsDAOMock]);
                DefectsDAOMock.defectRecordsMock = [{ imNumber: '1' }];
                DefectsDAOMock.numberOfRecords = 1;
                DefectsDAOMock.numberOfScannedRecords = 1;

                return defectsService.getDefectList()
                    .then((returnedRecords) => {
                        expect(returnedRecords).to.not.equal(undefined);
                        expect(returnedRecords).to.not.equal({});
                        expect(returnedRecords).to.eql(DefectsDAOMock.defectRecordsMock);
                        expect(returnedRecords.length).to.be.equal(DefectsDAOMock.defectRecordsMock.length);
                    });
            });
        });

        context('when db returns empty data', () => {
            it('should return 404-No resources match the search criteria', () => {
                const defectsService: DefectsService = Injector.resolve<DefectsService>(DefectsService, [DefectsDAOMock]);
                DefectsDAOMock.defectRecordsMock = {};
                DefectsDAOMock.numberOfRecords = 0;
                DefectsDAOMock.numberOfScannedRecords = 0;


                return defectsService.getDefectList()
                    .then(() => {
                        expect.fail();
                    }).catch((errorResponse) => {
                        //expect(errorResponse).to.be.instanceOf(HTTPError)
                        expect(errorResponse.statusCode).to.equal(404)
                        expect(errorResponse.body).to.equal('No resources match the search criteria.')
                    });
            })
        });

        context('when db return undefined data', () => {
            it('should return 404-No resources match the search criteria if db return null data', () => {
                const defectsService: DefectsService = Injector.resolve<DefectsService>(DefectsService, [DefectsDAOMock]);
                DefectsDAOMock.defectRecordsMock = undefined;
                DefectsDAOMock.numberOfRecords = 0;
                DefectsDAOMock.numberOfScannedRecords = 0;

                return defectsService.getDefectList()
                    .then(() => {
                        expect.fail();
                    }).catch((errorResponse) => {
                        expect(errorResponse).to.be.instanceOf(HTTPError);
                        expect(errorResponse.statusCode).to.equal(404);
                        expect(errorResponse.body).to.equal('No resources match the search criteria.');
                    });
            })
        })
    });

    describe("when database is off", () => {
        context('when db does not return response', () => {
            it('should return 500-Internal Server Error', () => {
                const defectsService: DefectsService = Injector.resolve<DefectsService>(DefectsService, [DefectsDAOMock]);
                DefectsDAOMock.isDatabaseOn = false;

                return defectsService.getDefectList()
                    .then(() => {
                        expect.fail();
                    })
                    .catch((errorResponse: HTTPError) => {
                        //expect(errorResponse).to.be.instanceOf(HTTPError)
                        expect(errorResponse.statusCode).to.be.equal(500)
                        expect(errorResponse.body).to.equal('Internal Server Error')
                    });
            })
        });
    });
})
