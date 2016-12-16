

/**
 * App ID for the skill
 */
var IDS = require('./appID')
var APP_ID = IDS.APPID

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var yelp = require('./yelp/index').createClient({

});



/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var YelpApp = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
YelpApp.prototype = Object.create(AlexaSkill.prototype);

YelpApp.prototype.constructor = YelpApp;

YelpApp.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};
    

YelpApp.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Ask me where you should eat!";

    response.ask(speechOutput);
};

YelpApp.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

YelpApp.prototype.intentHandlers = {
    // register custom intent handlers
    GetFirstRecommendationIntent: function (intent, session, response) {
        handleFirstEventRequest(intent, session, response);
     },
    
    GetMoreInfoIntent: function(intent, session, response) {
        handleMoreInfoEventRequest(intent, session, response);
    },
    
    GetAnotherIntent: function(intent, session, response) {
        handleAnotherEventRequest(intent,session,response);
    },
    
    FinishIntent: function(intent, session, response) {
        handleWrapupEventRequest(intent,session,response);
    },
    
    HelpIntent: function (intent, session, response) {
        response.ask("Ask me to eat. For instance, ask me where you should eat in Los Angeles.");
    }
};

function handleFirstEventRequest(intent, session, response) {
    var city = intent.slots.City;
    console.log(intent);
    console.log(city);
    var data = yelp.search({term: "food", location: city.value, limit: "5"}, function(error, data) {
    console.log(error);
    var wrapper = {};
    var index = Math.floor(Math.random() * data.businesses.length);
    var business = data.businesses[index];
    console.log("got back " + data.businesses.length + " restaurants");
    wrapper.index = index;
    wrapper.businesses = data.businesses;
    var categoryspeech = "";
    var speechOutput = "Ask me where you should eat!";
    var reccomendation = "you should try eating at " + business.name + ". They have a " + business.rating + " out of 5 star rating from " + business.review_count + " reviews. The restaurant category is " + business.categories[0][0] + ". Would you like to hear more?";
    session.attributes = wrapper;
    response.askWithCard(reccomendation, speechOutput, "yelp", reccomendation);
    });
}

function handleAnotherEventRequest(intent, session, response) {
    var wrapper = {}
    var oldindex = session.attributes.index
    var businesses = session.attributes.businesses
    wrapper.businesses = businesses
    businesses.splice(oldindex, 1)
    if (businesses.length < 1) {
            response.tell("Sorry, those are all of the reccomendations I had!");
    }
    var index = Math.floor(Math.random() * businesses.length)
    wrapper.index = index
    var business = businesses[index]
    var speechOutput = "Ask me where you should eat!"
    var reccomendation = "Okay, how about " + business.name + "? They have a " + business.rating + " out of 5 star rating from " + business.review_count + " reviews. The restaurant category is " + business.categories[0][0] + ". Would you like to hear more?";
    session.attributes = wrapper
    console.log(session.attributes)
    response.askWithCard(reccomendation, speechOutput, "yelp", reccomendation)
}

function handleMoreInfoEventRequest(intent, session, response) {
    var wrapper = {};
    wrapper.index = session.attributes.index
    wrapper.businesses = session.attributes.businesses;
    var business = wrapper.businesses[wrapper.index];
    var location = "";
    console.log(business.location);
    for (i = 0; i < business.location.display_address.length; i++) {
        location += " " + business.location.display_address[i] + ",";
    }
    
    location = location.substring(0, location.length - 1) + ".";
    var speechOutput = business.name + " is located at " + location + " Here is what someone had to say about the restaurant: " + business.snippet_text;
    session.attributes = wrapper;
    response.tellWithCard(speechOutput, "yelp", speechOutput);
}

function handleWrapupEventRequest(intent, session, response) {
    response.tell("Goodbye!");
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var helloWorld = new YelpApp();
    helloWorld.execute(event, context);
};