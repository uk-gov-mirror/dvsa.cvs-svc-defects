import LambdaTester from "lambda-tester";
import { handler } from "../../src/handler";

// This test literally tests nothing. Even if the function "returns" an error, it  passes. Need to majorly refactor.
describe("getDefects", () => {
  it("should return a promise", async () => {
    const lambda = LambdaTester(handler);
    await lambda.expectResolve((response: any) => {
      expect(response).toBeTruthy();
    });
  });
});
