
import { Response } from 'express';
import xml from 'xml';


/*

Okay so this function is created so that we dont need to manually check for xml or json headers and then set header and set status if xml and only then send the xml data(also the xml data needs to be hand written first :O  ))

something like that would look like this:

const type: string = req.headers['content-type']!;

const data: {} = {"some": "info"}

    if (type === 'application/xml') {
        res.status(status).setHeader('Content-Type', type);
        res.send(xml(data));
    } else if (type === 'application/json') {
        res.status(status).json(data);
    } else {
        res.status(415).send({
            error: 'Unsupported media type'
        })
    }

    now imagine all this code for every.... single.... request.... 

    so this is why with this bit of code we can jsut write responder(res, 200, req.headers['content-type']!, 'key1', 'value1', 'key2', 'value2')

*/




function responder(res: Response, status: number, type: string, ...args: any[]): void {

    const data: { [key: string]: string } = {}

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];
        data[key] = value;
    }

    if(res.req?.method === 'GET'){

        //TODO: Normal response should be xml but now if the Accept : */* it will default to xml

        if(res.req.accepts('application/xml')){
            res.status(status).setHeader('Content-Type', 'application/xml');
            res.send(xml(data));
            return;
        }
        res.status(status).json(data);
        return;
    }


    if (type === 'application/xml') {
        res.status(status).setHeader('Content-Type', type);
        res.send(xml(data));
    } else if (type === 'application/json') {
        res.status(status).json(data);
    } else {
        res.status(415).send({
            error: 'Unsupported media type'
        })
    }
    return;
}

export default responder