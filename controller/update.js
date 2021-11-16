const { user_games,user_game_biodata } = require('../models');
const bcrypt = require('bcrypt');

const encrypt = (password) => {
    return bcrypt.hashSync(password, 10);
}

const getUpdate = async (req, res) => {
    try {
        user_games.findOne({
            where: { id: req.user.id },
            include: {
                model: user_game_biodata,
                as: 'user_game_biodata'
            }
        }).then((update) => {
            res.render({ update })
        })
    }

    catch(err) {
        return res.json(err)
    }
}

const postUpdate = async (req, res) => {
    const { username, password, nama, email, umur } = req.body
    const encryptedPassword = encrypt(password);
    try {
        user_games.update({
            username,
            password: encryptedPassword
        },{ where: { id: req.user.id } })
        .then(() => {
            user_game_biodata.update({
                nama,
                email,
                umur
            }, { where: { user_id: req.user.id } })
        })

        const result = {
            status: "success"
        };
        return res.json(result);
    }

    catch(err) {
        return res.json(err)
    }
}


module.exports = {
    getUpdate,
    postUpdate
}