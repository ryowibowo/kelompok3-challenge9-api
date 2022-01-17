const { userGameBiodata } = require('../models');

// Run the game
const runRps = async (req, res) => {
  const suitResult = req.body.result;
  const { username } = req.user;

  try {
    // Check if the Input is Valid or not first
    if (suitResult.toLowerCase() !== 'win' && suitResult.toLowerCase() !== 'lose') {
      return res.status(406).send('Invalid Input');
    }

    // Grab the user from database based on JWT
    const currentUser = await userGameBiodata.findOne({
      where: { user_id: parseInt(req.user.id, 10) },
    }).then((user) => user);
    if (!currentUser) {
      return res.status(406).json({ status: 'error', message: 'user not found' });
    }
    // Grab the score of the user
    let playerScore = currentUser.score;

    // Add or deduct score from player
    if (suitResult === 'win') {
      playerScore += 1;
    }
    if (suitResult === 'lose') {
      playerScore -= 1;
    }

    // Update the player score to the database
    userGameBiodata.update(
      {
        score: playerScore,
      },
      { where: { user_id: req.user.id } },
    );
    // Send the result to client side
    return res.status(200).json({
      status: 'sucess',
      username,
      hasilSuit: suitResult,
      score: playerScore,
    });
  } catch (err) {
    return res.status(409).json({ status: 'error', message: 'database error' });
  }
};

module.exports = runRps;
