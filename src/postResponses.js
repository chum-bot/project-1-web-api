const r = require('./htmlResponses.js')
const allPokemon = require('../data/pokedex.json');
const allTypes = require('../data/types.json');

function createPokemon(request, response){
    const {name, imgLink, type1, type2, height, weight} = request.body;

    const badReqMessage = {
        message: "Your request was missing a required parameter.",
        id: "badRequest"
    }

    if(!name || !type1 || !height || !weight) {
        return r.respond(request, response, 400, badReqMessage, "application/json");
    }

    //check if the types are in fact types that exist in our type base
    //(which they will be able to add to)
    const type1Match = allTypes.find(t => t.name.toLowerCase() === type1.toLowerCase());
    if(!type1Match){
        badReqMessage.message = "Invalid first type.";
        return r.respond(request, response, 400, badReqMessage, "application/json");
    }
    if(type2) {
        const type2Match = allTypes.find(t => t.name.toLowerCase() === type2.toLowerCase());
        if(!type2Match){
            badReqMessage.message = "Invalid second type.";
            return r.respond(request, response, 400, badReqMessage, "application/json");
        }
    }
    
    let newPokemon = {
        id: allPokemon.length + 1,
        num: `${allPokemon.length + 1}`,
        name,
        type: [
            `${type1}`
        ],
        height: `${height} m`,
        weight: `${weight} kg`,
    }

    if(imgLink) newPokemon.img = imgLink; //i should proooooobably add some validation here
    if(type2) newPokemon.type.push(`${type2}`);

    allPokemon.push(newPokemon);
    return r.respond(request, response, 201, newPokemon, 'application/json')
}

//createType
//make a custom type that has weaknesses and resistances and immunities
//handleResponse will update the respective type fields on the page itself
function createType(request, response){
    const {name, weaknesses, resistances, immunities} = request.body;
    const badReqMessage = {
        message: "Invalid name: name must start with a letter."
    }

    //i want to check if it starts with a number, because the toUpper on the client will break if it starts with a number
    //that sounds like a job for regular expressions, but i am soooooo bad with regex
    //i'll try and understand this
    //i didn't copy from it, but i figured i should credit https://regex101.com/r/UK0JzR/1 for helping me understand regex
    //and mdn as well of course
    if(!/^[A-Za-z]/.test(name)) {
        return r.respond(request, response, 400, badReqMessage, 'application/json')
    }

    let newType = {
        name,
        weaknesses,
        resistances,
        immunities
    }

    allTypes.push(newType);
    return r.respond(request, response, 201, newType, 'application/json')
}

//changeType will allow you to change the type of an existing pokemon (that you grab by name)
function changeType(request, response){
    const {name, type1, type2}  = request.body;
    const badReqMessage = {
        message: "Invalid Pokemon name.",
        id: "badRequest"
    }
    const notFoundMessage = {
        message: "Pokemon not found.",
        id: "notFound"
    }
    
    //same check as the createType 
    if(!/^[A-Za-z]/.test(name)) {
        return r.respond(request, response, 400, badReqMessage, 'application/json')
    }

    const nameMatch = allPokemon.find(mon => mon.name.toLowerCase() === name.toLowerCase());
    if(!nameMatch) {
        return r.respond(request, response, 404, notFoundMessage, 'application/json')
    }

    //same checks as the getTypes
    const type1Match = allTypes.find(t => t.name.toLowerCase() === type1.toLowerCase());
    if(!type1Match){
        badReqMessage.message = "Invalid first type.";
        return r.respond(request, response, 400, badReqMessage, "application/json");
    }
    if(type2) {
        const type2Match = allTypes.find(t => t.name.toLowerCase() === type2.toLowerCase());
        if(!type2Match){
            badReqMessage.message = "Invalid second type.";
            return r.respond(request, response, 400, badReqMessage, "application/json");
        }
    }
    

}

module.exports = {
    createPokemon,
    changeType,
    createType
}