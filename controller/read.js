const { object } = require('webidl-conversions');
const { user_games, user_game_biodata } = require('../models');

const read = async (req, res) => {
    try {
        user_games.findOne({
            where: { id: req.params.id },
            include: {
                model: user_game_biodata,
                as: 'user_game_biodata'
            }
        }).then((results) => {
            res.json({
                "user_id": results.id,
                "username":results.username,
                "nama": results.user_game_biodata.nama,
                "email": results.user_game_biodata.email,
                "umur": results.user_game_biodata.umur,
                "score": results.user_game_biodata.score
            })
        })

    }

    catch (err) {
        return res.json(err)
    }
}

const readAll = async (req, res) => {
    try {
        const result = await user_games.findAll({
            raw:true,
            nest:true,
            include: {
                model: user_game_biodata,
                as: 'user_game_biodata'
            }
        })

        let data = []
        for(let i=0;i<result.length;i++){
            let myObj={
                "user_id": result[i].id,
                "username":result[i].username,
                "nama": result[i].user_game_biodata.nama,
                "email": result[i].user_game_biodata.email,
                "umur": result[i].user_game_biodata.umur,
                "score": result[i].user_game_biodata.score
            };
            data.push(myObj)
        }
        console.log(result[0])
        console.log(data)
        res.json(data)

    }

    catch (err) {
        return res.json(err)
    }
}

module.exports = {
    read,
    readAll
}