import supertest from "supertest";
import { HTTPRESPONSE } from "../../src/assets/Enums";
import { emptyDatabase, populateDatabase } from "../utils/dbOperations";

const url = "http://localhost:3001/";
const request = supertest(url);

describe("Defects Service", () => {
    beforeAll(async () => {
        await emptyDatabase();
    });

    afterAll(async () => {
        await populateDatabase();
    });

    context("when database is empty", () => {
        it("should return error code 404", async () => {
            try {
            const res = await request.get("defects");
            expect(res.ok).toBeFalsy();
            expect(res.status).toEqual(404);
            expect(res.text).toEqual(JSON.stringify(HTTPRESPONSE.RESOURCE_NOT_FOUND));
            }
            catch(err) {
                console.log('ERROR',err);
            }
        });
    });
});
