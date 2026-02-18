let r = require('./htmlResponses.js')

const users = {}

//get all users
function getUsers(request, response) {
    const responseJSON = {users};

    //i was going to let respond pass in the request method to check whether or not it was a HEAD request
    //but then i realized that respond already has that method (it's in the request i'm sending it)
    //so i built all that into the function itself, one less parameter to worry about
    r.respond(request, response, 200, responseJSON, 'application/json' /*, request.method === 'HEAD'*/);
}

//the not found checking function (routed to /notReal and can be visited directly)
function getNotFound(request, response) {
    const errorResp = {
        message: "The page you were looking for was not found.",
        id: 'notFound'
    }
    r.respond(request, response, 404, errorResp, 'application/json')
}

//adds a user to the users object above
function addUser(request, response) {
    //start with a base message
    const responseJSON = {
        message: 'Name and age are both required.'
    }

    //take the things we want out of the request body
    const { name, age } = request.body;

    //if we don't have the name or the age send them a bad request
    if(!name || !age) {
        responseJSON.id = 'addUserMissingParams'
        return r.respond(request, response, 400, responseJSON, "application/json")
    }
    
    //start with a 204 response code
    let responseCode = 204;

    //change the code to 201 if we're making a new user
    //then make a new user
    if(!users[name]) {
        responseCode = 201;
        users[name] = {
            name,
        }
    }
    users[name].age = age;

    //now check if we made a new user and break out with a 201 response
    if(responseCode === 201) {
        responseJSON.message = 'User added successfully'
        return r.respond(request, response, responseCode, responseJSON, 'application/json')
    }

    //204s reach here, and they have no return body
    return r.respond(request, response, responseCode, {}, 'application/json')
}

module.exports = {
    getUsers, 
    getNotFound,
    addUser
}