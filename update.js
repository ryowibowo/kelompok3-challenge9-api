const { User_game,User_game_biodata,User_game_history } = require('../models');

const getUpdate = async (req, res) => {
    try {
        User_game.findOne({
            where: { id: req.params.id },
            include: {
                model: User_game_biodata,
                as: 'user_game_biodatas'
            }
        }).then((update) => {
            res.render('update/update', { update })
        })
    }

    catch(err) {
        return res.json(err)
    }
}

const postUpdate = async (req, res) => {
    const { username, password, name, age } = req.body
    try {
        User_game.update({
            username,
            password
        },{ where: { id: req.params.id } })
        .then(() => {
            User_game_biodata.update({
                name,
                age
            }, { where: { id_user: req.params.id } })
            .then(() => {
                res.render('update/berhasilUpdate')
            })
        })
    }

    catch(err) {
        return res.json(err)
    }
}


module.exports = {
    getUpdate,
    postUpdate
}