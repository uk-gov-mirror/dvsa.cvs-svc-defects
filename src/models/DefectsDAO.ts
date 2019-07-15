import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import { Configuration } from '../utils/Configuration';

export class DefectsDAO {
    static readonly tableName = Configuration.Instance.generateConfig().DYNAMODB_TABLE_NAME;
    static readonly dbClient = AWSXRay.captureAWS(AWS).DynamoDB.DocumentClient(Configuration.Instance.generateConfig().DYNAMODB_DOCUMENTCLIENT_PARAMS)

    public getAll() {
        return DefectsDAO.dbClient.scan({ TableName: DefectsDAO.tableName }).promise()
    }

    public generatePartialParams() {
        return {
            RequestItems:
            {
                [DefectsDAO.tableName]: []
            }
        }
    }

    public createMultiple(defectItems) {
        let params = this.generatePartialParams()

        defectItems.forEach(defectItem => {
            params.RequestItems[DefectsDAO.tableName].push(
                {
                    PutRequest:
                    {
                        Item: defectItem
                    }
                })
        })

        return DefectsDAO.dbClient.batchWrite(params).promise()
    }

    public deleteMultiple(primaryKeysToBeDeleted) {
        let params = this.generatePartialParams()

        primaryKeysToBeDeleted.forEach(key => {
            params.RequestItems[DefectsDAO.tableName].push(
                {
                    DeleteRequest:
                    {
                        Key:
                        {
                            id: key
                        }
                    }
                }
            )
        })

        return DefectsDAO.dbClient.batchWrite(params).promise()
    }
}
