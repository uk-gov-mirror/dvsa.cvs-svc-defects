import { default as unwrappedAWS } from "aws-sdk";
import { Configuration } from "../utils/Configuration";
import { PromiseResult } from "aws-sdk/lib/request";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

/* workaround AWSXRay.captureAWS(...) call obscures types provided by the AWS sdk.
https://github.com/aws/aws-xray-sdk-node/issues/14
*/
/* tslint:disable */
const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(unwrappedAWS)
/* tslint:enable */


export class DefectsDAO {
    private readonly tableName: string;
    private static dbClient: DocumentClient;


    constructor() {
        const config: any = Configuration.getInstance().getDynamoDBConfig();
        this.tableName = config.table;
        if (!DefectsDAO.dbClient) {
            DefectsDAO.dbClient = new AWS.DynamoDB.DocumentClient(config.params);
        }
    }

    public getAll(): Promise<PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>> {
        return DefectsDAO.dbClient.scan({ TableName: this.tableName }).promise();
    }

    public generatePartialParams(): any {
        return {
            RequestItems:
            {
                [this.tableName]: []
            }
        };
    }

    public createMultiple(defectItems: any[]): Promise<any> {
        const params = this.generatePartialParams();

        defectItems.map((defectItem: any) => {
            params.RequestItems[this.tableName].push(
                {
                    PutRequest:
                    {
                        Item: defectItem
                    }
                });
        });

        return DefectsDAO.dbClient.batchWrite(params).promise();
    }

    public deleteMultiple(primaryKeysToBeDeleted: string[]): Promise<any> {
        const params = this.generatePartialParams();

        primaryKeysToBeDeleted.forEach((key) => {
            params.RequestItems[this.tableName].push(
                {
                    DeleteRequest:
                    {
                        Key:
                        {
                            id: key
                        }
                    }
                }
            );
        });

        return DefectsDAO.dbClient.batchWrite(params).promise();
    }
}
