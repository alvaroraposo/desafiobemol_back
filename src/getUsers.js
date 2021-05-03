'use strict';

module.exports.public = async event => {
    console.log(
        'Requesting public route...', new Date().toISOString()
    )

    return {
        statusCode: 200,
        body: JSON.stringify(
            [
                {
                    message: "Usuário não registrado. Usando rota pública"
                }
            ],
            null,
            2
        ),
    };

};

module.exports.private = async event => {

    console.log(
        'Requesting private route...', new Date().toISOString()
    )
    console.log(
        {
            'User': JSON.parse(
                event.requestContext.authorizer.user
            )
        }
    )
    return {
        statusCode: 200,
        body: JSON.stringify(
            [
                {
                    message: "Usuário logado com sucesso. Usando rota privada"
                }
            ],
            null,
            2
        ),
    };

};
