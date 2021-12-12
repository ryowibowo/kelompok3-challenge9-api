const { user_games,user_game_biodata } = require('../models');
const bcrypt = require('bcrypt');
const lc = require('lower-case')

const encrypt = (password) => {
    return bcrypt.hashSync(password, 10);
}

const lowerCU = (username) => {
    return lc.lowerCase(username)
}

const lowerCE = (email) => {
    return lc.lowerCase(email)
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
    const lowerCUS = lowerCU(username)
    const lowerCEM = lowerCE(email)

    try {
        if(req.body.username == "" || req.body.password == "" || req.body.nama == "" || req.body.email == "") {
            return res.status(406).json("Di Isi Terlebih Dahulu")
        }

        const user = await user_games.findOne({
            where: { username: lowerCUS  }
        });

        if (user) {       
            return res.status(406).json("Username Telah Terdaftar");
        }
    }

    catch(err){
        return res.status(400).json(err)
    }
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
        return res.status(202).json(result);
    }

    catch(err) {
        return res.status(400).json(err)
    }
}


module.exports = {
    getUpdate,
    postUpdate
}