const http = require('http')
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const jsonHandler = require('./jsonResponses.js')
const htmlHandler = require('./htmlResponses.js')
const query = require('querystring')

const urlStruct = {
    '/': htmlHandler.getIndex,
    index: htmlHandler.getIndex,    
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.getNotFound,
    '/addUser': jsonHandler.addUser
}

function parseBody(request, response, handler) {
    const body = [];

    //throw an error if we have one
    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    //reassemble the body
    request.on('data', (chunk) => {
        body.push(chunk);
    })

    //send back the completed body
    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];

        if(type === 'application/x-www-form-urlencoded') {
            request.body = query.parse(bodyString);
        }
        else if (type === 'application/json') {
            request.body = JSON.parse(bodyString);
        }
        else{
            response.writeHead(400, { 'Content-Type': 'application/json'});
            response.write(JSON.stringify({error: "Invalid data format"}));
            return response.end();
        }

        handler(request, response);
    })
}

//so the purpose of these handleGet and handlePost functions is essentially
//the same as the thing you use the struct for, to get each url and handle it
//except post uses parseBody because it needs to
function handleGet(request, response, parsedUrl) {
    const handler = urlStruct[parsedUrl.pathname];
    if(handler) {
        return handler(request, response);
    }
    return jsonHandler.getNotFound(request, response);
}

//hm... with this implementation would it then be possible to run one of the get urls through this post
//and actually have it work? i feel like it'd work 
//because all you would need is to just send POST through that url
//then it'd parse the one packet and send it back to the server
//it wouldn't do anything with said packet but it would come through
//a better implementation would be to make two handlers, one get and one post
//just so you wouldn't be able to do that bc that's weird and messy
//i'll do that for the project
function handlePost(request, response, parsedUrl) {
    const handler = urlStruct[parsedUrl.pathname];
    if(handler) {
        return parseBody(request, response, handler);
    }
    return jsonHandler.getNotFound(request, response);
}

function onRequest(request, response) {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if(request.method === "POST") {
        return handlePost(request, response, parsedUrl);
    }
    return handleGet(request, response, parsedUrl);
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
})