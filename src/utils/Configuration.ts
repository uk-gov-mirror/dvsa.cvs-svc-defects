
interface IDynamoDBConfig {
    DYNAMODB_DOCUMENTCLIENT_PARAMS?: Object;
    DYNAMODB_TABLE_NAME: string;
}

class Configuration {
    private static instance: Configuration;

    private constructor() {
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    public generateConfig(): IDynamoDBConfig | null {
        const BRANCH = process.env.BRANCH;
        const localConfig: IDynamoDBConfig =
        {
            DYNAMODB_DOCUMENTCLIENT_PARAMS:
            {
                region: 'localhost',
                endpoint: 'http://localhost:8001/'
            },
            DYNAMODB_TABLE_NAME: 'cvs-' + BRANCH + '-defects'
        }

        const pipelineConfig: IDynamoDBConfig =
        {
            DYNAMODB_DOCUMENTCLIENT_PARAMS: {},
            DYNAMODB_TABLE_NAME: 'cvs-' + BRANCH + '-defects'
        }

        if (!BRANCH) {
            console.error('Please define BRANCH environment variable')
            return null;
        } else if (BRANCH === 'local') {
            return localConfig;
        } else {
            return pipelineConfig;
        }
    }
}

export { IDynamoDBConfig, Configuration }