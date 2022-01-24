const { UserGameBiodata } = require('../models');

// Run the game
const runRps = async (req, res) => {
  const suitResult = req.body.result;
  const { username, id } = req.user;

  try {
    // Check if the Input is Valid or not first
    if (suitResult.toLowerCase() !== 'win' && suitResult.toLowerCase() !== 'lose') {
      return res.status(406).json('Invalid Input');
    }
    // Grab the user from database based on JWT
    const currentUser = await UserGameBiodata.findOne({
      where: { user_id: parseInt(id, 10) },
    }).then((user) => user);
    // Grab the score of the user
    if (!username || !id) {
      return res.status(406).json({ status: 'error', message: 'user not found' });
    }
    let playerScore = currentUser.score;

    // Add or deduct score from player
    if (suitResult === 'win') {
      playerScore += 1;
    }
    if (suitResult === 'lose') {
      playerScore -= 1;
    }

    // Update the player score to the database
    UserGameBiodata.update(
      {
        score: playerScore,
      },
      { where: { user_id: req.user.id } },
    );
    // Send the result to client side
    return res.status(200).json({
      status: 'success',
      username,
      hasilSuit: suitResult,
      score: playerScore,
    });
  } catch (err) {
    return res.status(409).json({ status: 'error', message: err });
  }
};

module.exports = runRps;
