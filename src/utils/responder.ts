import { json } from 'body-parser';
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
        console.log(data)

        // Convert the data object to XML (somehow this works)
        const xmlData = {
            response: Object.entries((Object.values(data))[1]).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    return { [key]: Object.entries(value).map(([k, v]) => {
                        if (Array.isArray(v)) {
                            return { [k]: v.map(item => ({ 'item': item })) };
                        } else {
                            return { [k]: v };
                        }
                    })};
                } else if (Array.isArray(value) && value.length > 0) {
                    return { [key]: value.map((val) => ({ _: val })) };
                } else {
                    return { [key]: value };
                }
            })
        }
        res.status(status).send(xml(xmlData, { declaration: true }));
        return;
    }

    // Default to 'application/json'
    res.setHeader('Accept', 'application/json');
    res.status(status).json(data);
    return;
}

export default responder;
