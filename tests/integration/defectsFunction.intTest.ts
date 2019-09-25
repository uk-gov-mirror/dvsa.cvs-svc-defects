import { handler } from "../../src/handler";
import mockContext from "aws-lambda-mock-context";
import { HTTPRESPONSE } from "../../src/assets/Enums";
import { emptyDatabase, populateDatabase } from "../utils/dbOperations";

describe("getDefects", () => {
  beforeAll(async () => {
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });

  it("should return a promise", async () => {
    const event = {
      path: "/defects",
      pathParameters: null,
      resource: "/defects",
      httpMethod: "GET",
      queryStringParameters: null
    };
    const ctx = mockContext();
    const response = await handler(event, ctx, () => { return; });
    ctx.succeed(response);
    expect(response).toBeDefined;
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual(JSON.stringify(HTTPRESPONSE.RESOURCE_NOT_FOUND));
  });
});
