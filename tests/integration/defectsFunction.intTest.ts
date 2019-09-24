import { handler } from "../../src/handler";
import mockContext from "aws-lambda-mock-context";
import { HTTPRESPONSE } from "../../src/assets/Enums";
const ctx = mockContext();

describe("getDefects", () => {
  it("should return a promise", async () => {
    const event = {
      path: "/defects",
      pathParameters: null,
      resource: "/defects",
      httpMethod: "GET",
      queryStringParameters: null
    };
    const response = await handler(event, ctx, () => { return; });
    ctx.succeed(true);
    expect(response).toBeDefined;
    expect(response.statusCode).toEqual(404);
  });
});
