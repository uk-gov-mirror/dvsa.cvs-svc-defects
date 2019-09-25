import supertest from "supertest";
import {HTTPRESPONSE} from "../../src/assets/Enums";

const url = "http://localhost:3001/";
const request = supertest(url);

describe("Defects Service", () => {
    context("when database is empty", () => {
        it("should return error code 404", async () => {
            const res = await request.get("defects");
            expect(res.ok).toBeFalsy();
            expect(res.status).toEqual(404);
            expect(res.text).toEqual(JSON.stringify(HTTPRESPONSE.RESOURCE_NOT_FOUND));
        });
    });
});
