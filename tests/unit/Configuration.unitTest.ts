import {expect} from "chai";
import {Configuration} from "../../src/utils/Configuration";
import {IDBConfig, IInvokeConfig} from "../../src/models";
import {ERRORS} from "../../src/assets/Enums";

describe("ConfigurationUtil", () => {
    const branch = process.env.BRANCH;
    context("when calling getConfig", () => {
        it("returns the full config object", () => {
            const conf = Configuration.getInstance().getConfig();
            expect(conf).to.contain.keys("invoke", "dynamodb");
            expect(conf.invoke).to.contain.keys("local", "remote");
            expect(conf.dynamodb).to.contain.keys("local", "local-global", "remote");
        });
    });

    context("when calling the getInvokeConfig()", () => {
        beforeEach(() => {jest.resetModules(); });

        context("the config is empty", () => {
            it("should throw error", () => {
                process.env.BRANCH = "local";
                const emptyConfig = new Configuration("../../tests/resources/EmptyConfig.yml");
                try {
                    emptyConfig.getInvokeConfig();
                    expect.fail();
                } catch (e) {
                    expect(e.message).to.equal(ERRORS.LambdaInvokeConfigNotDefined);
                }
            });
        });
        context("the BRANCH environment variable is local", () => {
            process.env.BRANCH = "local";
            const invokeConfig: IInvokeConfig = Configuration.getInstance().getInvokeConfig();
            it("should return the local invoke config", () => {
                expect(Object.keys(invokeConfig.functions)).to.contain("getDefects");
                expect(invokeConfig.params.apiVersion).to.exist;
                expect(invokeConfig.params.endpoint).to.exist;
            });
        });

        context("the BRANCH environment variable is not defined", () => {
            process.env.BRANCH = "";
            const invokeConfig: IInvokeConfig = Configuration.getInstance().getInvokeConfig();
            it("should return the local invoke config", () => {
                expect(Object.keys(invokeConfig.functions)).to.contain("getDefects");
                expect(invokeConfig.params.apiVersion).to.exist;
                expect(invokeConfig.params.endpoint).to.exist;
            });
        });

        context("the BRANCH environment variable is different than local", () => {
            process.env.BRANCH = "test";
            const invokeConfig: IInvokeConfig = Configuration.getInstance().getInvokeConfig();
            it("should return the remote S3 config", () => {
                expect(Object.keys(invokeConfig.functions)).to.contain("getDefects");
                expect(invokeConfig.params.apiVersion).to.exist;
                expect(invokeConfig.params.endpoint).to.not.exist;
            });
        });
    });

    context("when calling the getDynamoDBConfig()", () => {
        beforeEach(() => {jest.resetModules(); });

        context("the config is empty", () => {
            process.env.BRANCH = "local";
            const emptyConfig: Configuration = new Configuration("../../tests/resources/EmptyConfig.yml");
            it("should throw error", () => {
                try {
                    emptyConfig.getDynamoDBConfig();
                    expect.fail();
                } catch (e) {
                    expect(e.message).to.equal(ERRORS.DynamoDBConfigNotDefined);
                }
            });
        });
        context("the BRANCH environment variable is local", () => {
            process.env.BRANCH = "local";
            const dbConfig: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
            it("should return the local invoke config", () => {
                expect(dbConfig).to.contain.keys("params", "table", "keys");
                expect(dbConfig.table).to.equal("cvs-local-defects");
            });
        });

        context("the BRANCH environment variable is local", () => {
            process.env.BRANCH = "local-global";
            const dbConfig: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
            it("should return the local invoke config", () => {
                expect(dbConfig).to.contain.keys("params", "table");
                expect(dbConfig).to.not.contain.keys("keys");
                expect(dbConfig.table).to.equal("cvs-local-global-defects");
                expect(dbConfig.params).to.contain.keys("region", "endpoint");
            });
        });

        context("the BRANCH environment variable is 'develop'", () => {
            it("should return the remote invoke config", () => {
                process.env.BRANCH = "develop";
                // Switch to mockedConfig to simplify environment mocking
                const dbConfig: IDBConfig = getMockedConfig().getDynamoDBConfig(); expect(dbConfig).to.contain.keys("params", "table");
                expect(dbConfig).to.not.contain.keys("keys");
                expect(dbConfig.table).to.equal("cvs-develop-defects");
                expect(dbConfig.params).to.deep.equal({});
            });
        });

        context("the BRANCH environment variable is not defined", () => {
            it("should throw error", () => {
                process.env.BRANCH = "";
                try {
                    getMockedConfig().getDynamoDBConfig();
                    expect.fail();
                } catch (e) {
                    expect(e.message).to.equal(ERRORS.NoBranch);
                }
            });
        });
    });

    afterAll(() => {
        process.env.BRANCH = branch;
    });
});

/**
 * Configuration does the token replacement for ${BRANCH} on instantiation, so in order to
 * catch this early enough, need to use jest.resetModules() and a "require" import
 * of Configuration again
 */
const getMockedConfig: () => Configuration = () => {
    jest.resetModules();
    const ConfImp = require("../../src/utils/Configuration");
    return ConfImp.Configuration.getInstance();
};
