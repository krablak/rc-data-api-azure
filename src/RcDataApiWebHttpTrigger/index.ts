import fs from 'fs'
import path from 'path'

export default async function index(context: any, req: any) {
    context.log('JavaScript HTTP trigger function processed a request.')

    let fileContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')

    context.res = {
        status: 200,
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'text/html;charset=UTF-8'
        },
        body: fileContent
    };
};