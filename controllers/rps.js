const { User } = require('../models');

const result = ["Draw", "Player Win", "COM Win"]
//Result from rng function stored here
let comResult = "";
//Result from client-side input stored here
let playerSuit = "";
//Result from Suit
let suitResult = "";

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

//Random Number and determining Choice of COM
const rng = () => {
    let numberResult = Math.floor(Math.random() * 3);
    if (numberResult == 0) {
        return comResult = "Rock"
    }
    if (numberResult == 1) {
        return comResult = "Paper"
    }
    if (numberResult == 2) {
        return comResult = "Scissor"
    }
}


const runRps = async (req, res) => {
    try{
    if (req.body.playerInput != "Rock" && req.body.playerInput != "Scissor" && req.body.playerInput != "Paper") {
        return res.send("Invalid Input")
    }

    let currentUser = await User.findOne({
        where: { username: req.user.username }
    }).then(user=>{return user});
    let playerScore = currentUser.score; 

    playerSuit = req.body.playerInput;
    rng();
    rps();

    if (suitResult == result[1]) {
        playerScore += 1
    }
    if (suitResult == result[2]) {
        playerScore -= 1
    }
    console.log(suitResult)
    console.log(playerSuit)
    console.log(comResult)
    console.log(playerScore)
    User.update({
        score: playerScore
    },
        { where: { username: currentUser.username } }
    )
    res.json({
        "inputPlayer": playerSuit,
        "inputComputer": comResult,
        "hasilSuit": suitResult,
        "score": playerScore
    })}

    catch(err){
        res.json(err)
    }
}

module.exports = runRps;
