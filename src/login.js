const JWT_KEY = process.env.JWT_KEY
const { sign } = require('jsonwebtoken')
const AWS = require('aws-sdk'); 
const Joi = require('@hapi/joi')
const DynamoDBAccess = require('./../db/dynamoDB.js');
const dynamoDbSvc = new AWS.DynamoDB.DocumentClient();
const bcrypt = require('bcrypt')

const validator = () => {
    return Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().max(100).min(6).required(),        
    })
}

const headers = {
    'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
    'Access-Controle-Allow-Credentials': true,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

const handleResponse = (statusCode, message) => {
    return {
        statusCode,
        headers,
        body: JSON.stringify(
            [
                {                    
                    message
                }
            ],
            null,
            2
        ),
    };    
}

const login = async event => {
    const {
        username,
        password
    } = JSON.parse(event.body)
    // do validations!!!   
    const loginUser = {
        username,
        password
    }      

    const {error, value} = await validator().validate(loginUser);
    if(error && error.details && error.details.length > 0) {
        return handleResponse(403, error.details[0].message)
    }

    const dynamoDB = new DynamoDBAccess(dynamoDbSvc);
    const q = await dynamoDB.query(username);

    if(!q || q.Items.length != 1) {
        return handleResponse(401, "Unauthorized")
    }

    const comparePassword = await bcrypt.compare(password, q.Items[0].password)
    const validUser = (q.Items[0].username == username && comparePassword) ? q.Items[0] : null;

    if(!validUser) {
        return handleResponse(401, "Unauthorized")
    }

    const signUser = {
        scopes: validUser.scopes,
        username: validUser.username
    }

    const token = sign({
        user: signUser,
        // 5 minutos
    }, JWT_KEY, { expiresIn: '5m'})

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            token,
            firstname : validUser.firstname
        })
    }
}

exports.handler = login