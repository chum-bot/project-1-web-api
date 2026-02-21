const r = require('./htmlResponses.js')
const allPokemon = require('../data/pokedex.json');

//getAll
//just gets and shows all of the pokemon
function getAll(request, response) {
    r.respond(request, response, 200, allPokemon, 'application/json')
}

//getByName
//gets a pokemon by a specified name
function getByName(request, response){
    let errorResp = {
        message: "No Pokemon was found with that name.",
        id: "notFound"
    }
    const name = request.query.name;

    const foundMon = allPokemon.find(mon => mon.name.toLowerCase() === name.toLowerCase());
    if(foundMon) {
        return r.respond(request, response, 200, foundMon, 'application/json')
    }
    return r.respond(request, response, 404, errorResp, 'application/json')
}

//getByType
//gets all the pokemon that have any one of a specified batch of types
function getByType(request, response){
    const foundMons = [];
    const types = request.query.types.split(',');
    //making it a comma separated list because that makes sense to me
    //but there might be a better way to do it/a better practice
    //i want to just send over an array of types ideally
    //so i can array comparison them when i get here
    let errorResp = {
        message: "No type was selected.",
        id: "badRequest"
    }

    allPokemon.forEach(mon => {
        const typesMatch = mon.type.some(t => types.includes(t.toLowerCase()))
        if(typesMatch) {
            foundMons.push(mon);
        }
    })

    if(foundMons.length === 0) {
        return r.respond(request, response, 400, errorResp, 'application/json')
    }
    return r.respond(request, response, 200, foundMons, 'application/json')
}

//getByDexNumber
//retrieves a mon by their dex number
function getByDexNumber(request, response){
    let errorResp = {
        message: "No Pokemon was found with that Pokedex number.",
        id: "notFound"
    }
    const number = request.query.dexNumber;
    const foundMon = allPokemon[number-1]; //quite easy indeed

    if(foundMon) {
        return r.respond(request, response, 200, foundMon, 'application/json')
    }
    return r.respond(request, response, 404, errorResp, 'application/json')
}

//fallback in case they end up somewhere that doesn't exist
function getNotFound(request, response) {
    const errorResp = {
        message: "The page you were looking for was not found.",
        id: 'notFound'
    }
    r.respond(request, response, 404, errorResp, 'application/json')
}

module.exports = {
    getAll,
    getNotFound,
    getByName,
    getByType,
    getByDexNumber
}