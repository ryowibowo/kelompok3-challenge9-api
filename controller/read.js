const { user_games,user_game_biodata } = require('../models');

const read = async (req, res) => {
   try {
     user_games.findOne({
        where: { id: req.params.id },
        include: {
            model: user_game_biodata,
            as: 'user_game_biodata'
        }
    }).then((read) => {
        res.json({ read })
    })

   }

   catch (err) {
       return res.json(err)
   }
}

module.exports = {
    read
}