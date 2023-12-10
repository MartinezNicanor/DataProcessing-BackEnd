import { Response } from 'express';
import xml from 'xml';

function responder(res: Response, status: number, ...args: any[]): void {

    const data: { [key: string]: string } = {};

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];
        data[key] = value;
    }

    // Check if the client accepts JSON
    if (res.req?.accepts('application/json')) {
        res.setHeader('Accept', 'application/json');
        res.status(status).json(data);
        return;
    }

    // Check if the client accepts XML
    if (res.req?.accepts('application/xml')) {
        res.setHeader('Accept', 'application/xml');
        res.status(status).send(xml(data));
        return;
    }

    // Default to 'application/json'
    res.setHeader('Accept', 'application/json');
    res.status(status).json(data);
    return;
}

export default responder;
