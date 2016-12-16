# Alexa Yelp #

This project is my personal attempt at creating a yelp restaurant finder application for Alexa.
It uses the Alexa Skills Kit and Amazon Lambda

## How do I get set up? ##

* If you are unfamiliar with Alexa Skills, check out Amazon's [getting started guide](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/getting-started-guide)
* After creating an Alexa Skill, add the text from [here](IntentSchema.json) to your intent schema
* Add the text from [Sample Utterances](SampleUtterances.txt) to the Sample utterances
* run `npm install --save yelp` under the src/ directory
* modify appID.js to contain your Alexa Skill ID, and your yelp v2 API key (get one here: https://www.yelp.com/developers/v2)
* cd into the src directory, and zip up all the contents.
* upload zip to Amazon Lambda

## How do I use this? ##
Ask "Where should I go to eat in ${location}" to get a random yelp reccomendation of where to eat
When Alexa gives you a reccomendation, say "yes" to hear more about the restaurant, "no" or "next" to get another restaurant, or "stop" to make Alexa shut up
Checkout the [Sample Utterances file](SampleUtterances.txt) to see other ways to invoke this skill  

# License #
Licensed under the [Don't Be A Dick](LICENSE.md) public license
