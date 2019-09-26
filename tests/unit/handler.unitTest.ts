import { handler } from "../../src/handler";
import event from "../resources/event.json";
import { Configuration } from "../../src/utils/Configuration";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import mockContext from "aws-lambda-mock-context";
import { DefectsService } from "../../src/services/DefectsService";
const ctx = mockContext();
jest.mock("../../src/services/DefectsService");

describe("The lambda function handler", () => {

  context("With correct Config", () => {
    context("should correctly handle incoming events", () => {
      it("should call functions with correct event payload", async () => {
        // Specify your event, with correct path, payload etc
        const vehicleRecordEvent = event;

        // Stub out the actual functions
        DefectsService.prototype.getDefectList = jest.fn().mockImplementation(() => {
          return Promise.resolve(new HTTPResponse(200, {}));
        });

        // @ts-ignore
        const result = await handler(vehicleRecordEvent, ctx);
        expect(result.statusCode).toEqual(200);
        expect(DefectsService.prototype.getDefectList).toHaveBeenCalled();
      });

      it("should return error on empty event", async () => {
        // @ts-ignore
        const result = await handler(null, ctx);

        expect(result).toBeInstanceOf(HTTPResponse);
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(JSON.stringify("AWS event is empty. Check your test event."));
      });

      it("should return error on invalid body json", async () => {
        const invalidBodyEvent = Object.assign({}, event);
        invalidBodyEvent.body = '{"hello":}';

        // @ts-ignore
        const result = await handler(invalidBodyEvent, ctx, null);
        expect(result).toBeInstanceOf(HTTPResponse);
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(JSON.stringify("Body is not a valid JSON."));
      });

      it("should return a Route Not Found error on invalid path", async () => {
        const invalidPathEvent = Object.assign({}, event);
        // invalidPathEvent.body = ""
        invalidPathEvent.path = "/vehicles/123/doesntExist";

        // @ts-ignore
        const result = await handler(invalidPathEvent, ctx);
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(JSON.stringify({ error: `Route ${invalidPathEvent.httpMethod} ${invalidPathEvent.path} was not found.` }));
      });
    });
  });

  context("With no routes defined in config", () => {
    it("should return a Route Not Found error", async () => {
      const getFunctions = Configuration.prototype.getFunctions;
      Configuration.prototype.getFunctions = jest.fn().mockImplementation(() => []);
      const event = { httpMethod: "GET", path: "" };
      const result = await handler(event, ctx, () => { return; });
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual(JSON.stringify({ error: `Route ${event.httpMethod} ${event.path} was not found.` }));
      Configuration.prototype.getFunctions = getFunctions;
    });
  });
});

describe("The configuration service", () => {
  context("with good config file", () => {
    it("should return local versions of the config if specified", () => {
      process.env.BRANCH = "local";
      const configService = Configuration.getInstance();
      const functions = configService.getFunctions();
      expect(functions.length).toEqual(1);
      expect(functions[0].name).toEqual("getDefects");
      const DBConfig = configService.getDynamoDBConfig();
      expect(DBConfig).toEqual(configService.getConfig().dynamodb.local);
    });

    it("should return local-global versions of the config if specified", () => {
      process.env.BRANCH = "local-global";
      const configService = Configuration.getInstance();
      const functions = configService.getFunctions();
      expect(functions.length).toEqual(1);
      expect(functions[0].name).toEqual("getDefects");
      const DBConfig = configService.getDynamoDBConfig();
      expect(DBConfig).toEqual(configService.getConfig().dynamodb["local-global"]);
    });

    it("should return remote versions of the config by default", () => {
      process.env.BRANCH = "CVSB-XXX";
      const configService = Configuration.getInstance();
      const functions = configService.getFunctions();
      expect(functions.length).toEqual(1);
      expect(functions[0].name).toEqual("getDefects");
      const DBConfig = configService.getDynamoDBConfig();
      expect(DBConfig).toEqual(configService.getConfig().dynamodb.remote);
    });
  });

  context("with bad config file", () => {
    it("should return an error for missing functions from getFunctions", () => {
      const config = new Configuration("../../tests/resources/badConfig.yml");
      try {
        config.getFunctions();
      } catch (e) {
        expect(e.message).toEqual("Functions were not defined in the config file.");
      }
    });

    it("should return an error for missing DB Config from getDynamoDBConfig", () => {
      const config = new Configuration("../../tests/resources/badConfig.yml");
      try {
        config.getDynamoDBConfig();
      } catch (e) {
        expect(e.message).toEqual("DynamoDB config is not defined in the config file.");
      }
    });
  });
});
