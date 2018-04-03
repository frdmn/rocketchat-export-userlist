var fs = require('fs'),
    RocketChatApi = require('rocketchat').RocketChatApi,
    RocketChatClient = require('rocketchat').RocketChatClient,
    async = require('async'),
    converter = require('json-2-csv');

// Load configuration object for RocketChat API from JSON
var config = require('./config.json');

// Create client 
var rocketChatClient = new RocketChatClient(config);

// Empty array that will hold the user objects
var userArray = [];

/**
 * Function to repeatetly send rocketChatClient.users.list()
 * to iterate over result pagination (default max count = 100)
 * until final page is received
 * @param {Integer} offset Optional offset can be passed
 */
function sendUserListApiRequest(offset = 0){
    var count = 100;

    // Actual function to list users
    rocketChatClient.users.list(offset, count, function (err, body) {
        if (err) {
            // Abort on possible errors
            console.log("error: ", err);
            return false;
        }

        var total = body.total,
            users = body.users;

        // Iterate over each user (asynchronously to not start another request until iteration is completed)
        async.eachSeries(users, function(user, cb){
            // Parse desired keys that will be exposed in the export file
            var userObject = {
                "_id": user._id,
                "username": user.username,
                "name": user.name,
                "type": user.type,
                "status": user.status,
                "lastLogin": user.lastLogin,
                "createdAt": user.createdAt,
                "_updatedAt": user._updatedAt
            };

            // Push to userArray
            userArray.push(userObject);
            // Callback to let eachSeries() know about current user processing
            return cb(null);
        },function(err) {
            // Iteration completed
            console.log("Added " + users.length + " users to array (" + userArray.length + " in total)...");
            // Check if there more users that needs to be processed (with another API request)
            if (userArray.length < total) {
                sendUserListApiRequest(userArray.length, count);
            } else if(userArray.length === total){
                console.log('Successfully added all ' + userArray.length + ' users to array');

                // Convert to CSV
                converter.json2csv(userArray,function(err, csv){
                    if(err) return console.log(err);

                    fs.writeFile(config.exportfile, csv, function(err) {
                        if(err) {
                            return console.log(err);
                        }

                        console.log("Succesfully exported users and written to " + config.exportfile + "!");
                        process.exit(0);
                    }); 
                }, {
                    checkSchemaDifferences: false,
                    delimiter: {
                        wrap: '"'
                    }
                });
            }
        });
    });
}

// Authenticate using admin credentials stored in config object
rocketChatClient.authentication.login(config.username, config.password, function(err, body) {
	if (!err) {
        // Call sendUserListApiRequest() if no error 
		sendUserListApiRequest();
	} else {
        // Print possible errors
        console.log("error: ", err);
		process.exit(1);
	}
})
