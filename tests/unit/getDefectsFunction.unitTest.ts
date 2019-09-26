import { getDefects } from "../../src/functions/getDefects";
import { DefectsService } from "../../src/services/DefectsService";
import mockContext from "aws-lambda-mock-context";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { HTTPError } from "../../src/models/HTTPError";
jest.mock("../../src/services/DefectsService");
const opts = Object.assign({
    timeout: 0.5
});


describe("getDefects Function", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    context("on success of downstream services", () => {
        it("returns 200 with data", async () => {
            DefectsService.prototype.getDefectList = jest.fn().mockImplementation(() => {
                return Promise.resolve("success");
            });
            let ctx: any = mockContext(opts);
            const result = await getDefects(null, ctx, () => { return; });
            ctx.succeed(result);
            ctx = null;
            expect(result).toEqual(new HTTPResponse(200, "success"));
        });
    });

    context("on failure of downstream services", () => {
        it("returns 200 with data", async () => {
            DefectsService.prototype.getDefectList = jest.fn().mockImplementation(() => {
                return Promise.reject(new HTTPError(418, "Failed"));
            });
            let ctx: any = mockContext(opts);
            const result = await getDefects(null, ctx, () => { return; });
            ctx.succeed(result);
            ctx = null;
            expect(result).toEqual(new HTTPResponse(418, "Failed"));
        });
    });
});
