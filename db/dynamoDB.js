const uuid = require('uuid')

class DynamoDBAccess {
    constructor(dynamoDBSvc) {
        this.dynamoDBSvc = dynamoDBSvc;
    }
    
    async query(username) {
        const dynamoDbUser = await this.dynamoDBSvc.query({
            TableName: "users",
            IndexName: "username-index",
            KeyConditionExpression: "username = :hkey",
            ExpressionAttributeValues: {
                ':hkey': username
            }
        }).promise();

        return dynamoDbUser;
    }

    async create(user) {
        user.id = uuid.v1();

        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
              ...user
            },
        };

        await this.dynamoDBSvc.put(params).promise();
        return user;
    }
}

module.exports = DynamoDBAccess

