'use strict';

const AWS = require('aws-sdk'); 
const DynamoDBAccess = require('./../db/dynamoDB.js')
const Joi = require('@hapi/joi')
const JoiDate = require('@hapi/joi-date')
const dynamoDbSvc = new AWS.DynamoDB.DocumentClient()
const bcrypt = require('bcrypt')
const saltRounds = 10
const headers = {
    'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
    'Access-Controle-Allow-Credentials': true,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

const validator = () => {
    const jd = Joi.extend(JoiDate);

    return Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().max(100).min(6).required(),
        firstname: Joi.string().max(30).min(2).required(),
        lastname: Joi.string().max(30).min(2).required(),
        birthdate: jd.date().format("DD/MM/YYYY"),
        gender: Joi.string().max(10).min(4).required(),
        cpf: Joi.string().max(11).min(11).required(),
        rg: Joi.string().max(20).min(5).required(),
        cellphone: Joi.string().max(20).min(8).required(),
        fixedphone: Joi.string().allow('').max(20).trim(),
        fullAddress: Joi.object().required().keys({
            cep: Joi.string().max(8).min(8).required(),
            type: Joi.string().max(20).min(2).required(),
            owner: Joi.string().allow('').max(100).trim(),
            address: Joi.string().max(100).min(5).required(),
            number: Joi.string().max(20).min(2).required(),
            complement: Joi.string().max(100).min(2).required(),
            district: Joi.string().max(100).min(2).required(),
            city: Joi.string().max(100).min(2).required(),
            state: Joi.string().max(100).min(2).required(),
            reference: Joi.string().max(100).min(2).required(),
        }),
        scopes: Joi.array().min(1).required()
        /* 
        https://runkit.com/thian4/5d8058ac7ee5640014e4d01a
        
        */
    })
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

module.exports.handler = async event => {
    console.log(
        'Create user route...', new Date().toISOString()
    )
    
    const dynamoDB = new DynamoDBAccess(dynamoDbSvc);
    console.log("Parsing json body", event.body);
    const user = JSON.parse(event.body);    
    console.log("Parsed json body");

    try {

        const {error, value} = await validator().validate(user);

        if(error && error.details && error.details.length > 0)
            return handleResponse(403, error.details[0].message)

        const queryResult = await dynamoDB.query(user.username);
        if(queryResult.Count > 0)
            return handleResponse(501, "E-Mail já cadastrado como usuário do sistema")
        
        const encryptedPassword = await bcrypt.hash(user.password, saltRounds)
        user.password = encryptedPassword;

        await dynamoDB.create(user);
        
        return handleResponse(200, "Usuário cadastrado com sucesso")
    }
    catch(error) {
        console.error('Deu ruim**', error.stack)
        return handleResponse(500, "Erro interno no servidor")
    }    
};