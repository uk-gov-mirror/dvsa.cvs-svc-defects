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

  it("should throw 404 when no records in dynamodb", async () => {
    const event = {
      path: "/defects",
      pathParameters: null,
      resource: "/defects",
      httpMethod: "GET",
      queryStringParameters: null
    };
    const opts = Object.assign({
      timeout: 0.5
    });
    let ctx: any = mockContext(opts);
    const response = await handler(event, ctx, () => { return; });
    ctx.succeed(response);
    ctx = null;
    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual(JSON.stringify(HTTPRESPONSE.RESOURCE_NOT_FOUND));
  });
});
