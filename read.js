const { User_game,User_game_biodata,User_game_history } = require('../models');

const read = async (req, res) => {
   try {
    User_game.findOne({
        where: { id: req.params.id },
        include: {
            model: User_game_biodata,
            as: 'user_game_biodatas'
        }
    }).then((read) => {
        res.render('read/read', { read })
    })
   }

   catch (err) {
       return res.json(err)
   }
}

module.exports = {
    read
}