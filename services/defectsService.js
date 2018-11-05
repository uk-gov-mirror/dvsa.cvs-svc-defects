'use strict'

const AWS = require('aws-sdk')
const HTTPResponseStatus = require('../models/HTTPResponseStatus')

const dbClient = new AWS.DynamoDB.DocumentClient(
  process.env.IS_OFFLINE ? { region: 'localhost', endpoint: 'http://localhost:8000' } : {}
)

/**
 * Fetches the entire list of Defects from the database.
 * @returns Promise
 */
const getDefectList = () => {
  const params = {
    TableName: 'Defects'
  }

  return dbClient.scan(params)
    .promise()
    .then((result) => {
      if (result.$response.error) {
        throw new HTTPResponseStatus(result.$response.error.statusCode, result.$response.error.message)
      }

      if (result.Count === 0 || result.Items === undefined) {
        throw new HTTPResponseStatus(404, { error: 'No resources match the search criteria.' })
      }

      return result.Items
    })
}

module.exports = getDefectList