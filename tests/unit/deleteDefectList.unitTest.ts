import { DefectsService } from "../../src/services/DefectsService";
import { Injector } from "../../src/models/injector/Injector";
import { DefectsDAOMock } from "../models/DefectsDAOMock";
import { expect } from "chai";
import { HTTPError } from "../../src/models/HTTPError";

describe('deleteDefectList', () => {
    describe("when database is off", () => {
        context('when db does not return response', () => {
            it('should return 500-Internal Server Error', () => {
                const defectsService: DefectsService = Injector.resolve<DefectsService>(DefectsService, [DefectsDAOMock]);
                DefectsDAOMock.isDatabaseOn = false;
                DefectsDAOMock.defectRecordsMock = require('../resources/defects.json');

                return defectsService.deleteDefectList(DefectsDAOMock.defectRecordsMock)
                    .catch((errorResponse) => {
                        expect(errorResponse).to.be.instanceOf(HTTPError)
                        expect(errorResponse.statusCode).to.be.equal(500)
                        expect(errorResponse.body).to.equal('Internal ServerError')
                    });
            });
        });
    });

    describe("when database is on", () => {
        context('when deleting a valid defects array', () => {
            it('should return 200', () => {
                const defectsService: DefectsService = Injector.resolve<DefectsService>(DefectsService, [DefectsDAOMock]);
                DefectsDAOMock.isDatabaseOn = true;
                DefectsDAOMock.defectRecordsMock = require('../resources/defects.json');

                return defectsService.deleteDefectList(DefectsDAOMock.defectRecordsMock)
                    .then((result: any) => {
                          expect(Object.keys(result).length).to.equal(0);
                          expect(result.constructor).to.equal(Object);
                    });
            });
        });
    });
});
