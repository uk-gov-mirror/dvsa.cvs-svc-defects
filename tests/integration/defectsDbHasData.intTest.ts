import supertest from "supertest";
import fs from "fs";
import path from "path";
import { populateTestDatabase, emptyTestDatabase, emptyDatabase, populateDatabase } from "../utils/dbOperations";

const url = "http://localhost:3001/";
const request = supertest(url);

describe("getDefects", () => {
    beforeAll(async () => {
        await emptyDatabase();
    });

    beforeEach(async () => {
        await populateTestDatabase();
    });

    afterEach(async () => {
        await emptyTestDatabase();
    });

    afterAll(async () => {
        await populateDatabase();
    });
    

    context("when database is populated", () => {
        it("should return all defects in the database", async () => {
            const defectsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/defects.json"), "utf8"));
            const expectedResponse = JSON.parse(JSON.stringify(defectsData.splice(0, 5))).map((defect: { id: any; }) => {
                delete defect.id;
                return defect;
            }).sort((first: { imNumber: number; }, second: { imNumber: number; }) => first.imNumber - second.imNumber);

            const res = await request.get("defects");
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(expectedResponse.length);
        });
    });
});
