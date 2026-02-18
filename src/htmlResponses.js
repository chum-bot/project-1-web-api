const fs = require('fs')

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

//our general response function, i'm exporting it out of here for use later
function respond(request, response, status, content, type) {
    if(type === 'application/json') content = JSON.stringify(content);
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    if(request.method !== "HEAD") response.write(content);
    response.end();
}

function getIndex(request, response){
    respond(request, response, 200, index, 'text/html');
}
function getCSS(request, response){
    respond(request, response, 200, css, 'text/css');
}

module.exports = {
    getIndex,
    getCSS,
    respond
}