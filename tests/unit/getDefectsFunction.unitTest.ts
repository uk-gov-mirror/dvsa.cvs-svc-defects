import {getDefects} from "../../src/functions/getDefects";
import {DefectsService} from "../../src/services/DefectsService";
import mockContext from "aws-lambda-mock-context";
import {HTTPResponse} from "../../src/models/HTTPResponse";
import {HTTPError} from "../../src/models/HTTPError";
const ctx = mockContext();


describe("getDefects Function", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    context("on success of downstream services", () => {
        it("returns 200 with data", async () => {
            DefectsService.prototype.getDefectList = jest.fn().mockImplementation(() => {
                return Promise.resolve("success");
              });
        //    sandbox.stub(DefectsService.prototype, "getDefectList").resolves("success");
            const res = await getDefects(null, ctx, () => {return; });
            expect(res).toEqual(new HTTPResponse(200, "success"));
        });
    });

    context("on failure of downstream services", () => {
        it("returns 200 with data", async () => {
            DefectsService.prototype.getDefectList = jest.fn().mockImplementation(() => {
                return Promise.reject(new HTTPError(418, "Failed"));
              });
            // sandbox.stub(DefectsService.prototype, "getDefectList").rejects(new HTTPError(418, "Failed"));
            const res = await getDefects(null, ctx, () => {return; });
            expect(res).toEqual(new HTTPResponse(418, "Failed"));
        });
    });
});
