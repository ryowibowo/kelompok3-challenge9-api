const { user_game_biodata } = require('../models');

const result = ["Draw", "Player Win", "COM Win"]
//Result from rng function stored here
let comResult = "";
//Result from client-side input stored here
let playerSuit = "";
//Result from Suit
let suitResult = "";
//Result of choice that make the player lose
let losingSuit = "";


//Suit Logic Function
const rps = () => {
    //Check If it is a Draw First
    if (comResult == playerSuit) {
        return suitResult = result[0];
    }
    //Check If The Player Win
    if (comResult == "Scissor" && playerSuit == "Paper" || comResult == "Paper" && playerSuit == "Rock" || comResult == "Rock" && playerSuit == "Scissor") {
        return suitResult = result[2];
    }
    //Otherwise, return COM Win
    return suitResult = result[1]
}

//Random Number and determining Choice of COM using Math.Floor with the number 0-3
const rng = () => {
    let numberResult = Math.floor(Math.random() * 4);
    if (numberResult == 0) {
        return comResult = "Rock"
    }
    if (numberResult == 1) {
        return comResult = "Paper"
    }
    if (numberResult == 2) {
        return comResult = "Scissor"
    }
    if (numberResult == 3) {
        return comResult = losingSuit
    }
}

//Determine the choice that makes the player lose
const rig = () => {
    if (playerSuit == "Rock") {
        return losingSuit = "Paper"
    }
    if (playerSuit == "Paper") {
        return losingSuit = "Scissor"
    }
    return losingSuit = "Rock"
}

//Run the game
const runRps = async (req, res) => {
    try {
        //Check if the Input is Valid or not first
        if (req.body.playerInput != "Rock" && req.body.playerInput != "Scissor" && req.body.playerInput != "Paper") {
            return res.send("Invalid Input")
        }

        //Grab the user from database based on JWT
        let currentUser = await user_game_biodata.findOne({
            where: { user_id: parseInt(req.user.id,10) }
        }).then(user => { return user });
        //Grab the score of the user
        let playerScore = currentUser.score;

        //Read the input from client side
        playerSuit = req.body.playerInput;
        //Run the function necessary 
        rig();
        rng();
        rps();

        //Add or deduct score from player
        if (suitResult == result[1]) {
            playerScore += 1
        }
        if (suitResult == result[2]) {
            playerScore -= 1
        }

        //Update the player score to the database
        user_game_biodata.update({
            score: playerScore
        },
            { where: { user_id: req.user.id } }
        )
        //Send the result to client side
        res.json({
            "inputPlayer": playerSuit,
            "inputComputer": comResult,
            "hasilSuit": suitResult,
            "score": playerScore
        })
    }

    catch (err) {
        res.json(err)
    }
}

module.exports = runRps;
