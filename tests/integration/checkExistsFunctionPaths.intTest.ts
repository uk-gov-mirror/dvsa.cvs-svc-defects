import { handler } from "../../src/handler";
import mockContext from "aws-lambda-mock-context";
import { HTTPRESPONSE } from "../../src/assets/Enums";
import { emptyDatabase, populateDatabase, populateTestDatabase, emptyTestDatabase } from "../utils/dbOperations";

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

  it("should detect exported path /defects", async () => {
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
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).length).toEqual(5);
  });
});
