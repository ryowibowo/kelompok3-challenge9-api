const { user_game_biodata } = require('../models');

//Result from Suit
let suitResult = "";

//Run the game
const runRps = async (req, res) => {
    suitResult=req.body.result

    try {
        //Check if the Input is Valid or not first
        if (suitResult.toLowerCase() != "win" && suitResult.toLowerCase() != "lose" ) {
            return res.status(406).send("Invalid Input")
        }

        //Grab the user from database based on JWT
        let currentUser = await user_game_biodata.findOne({
            where: { user_id: parseInt(req.user.id,10) }
        }).then(user => { return user });
        //Grab the score of the user
        let playerScore = currentUser.score;

        //Add or deduct score from player
        if (suitResult == "win") {
            playerScore += 1
        }
        if (suitResult == "lose") {
            playerScore -= 1
        }

        //Update the player score to the database
        user_game_biodata.update({
            score: playerScore
        },
            { where: { user_id: req.user.id } }
        )
        //Send the result to client side
        res.status(202).json({
            "hasilSuit": suitResult,
            "score": playerScore
        })
    }

    catch (err) {
        res.status(400).json(err)
    }
}

module.exports = runRps;
