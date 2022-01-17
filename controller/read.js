const { userGames, userGameBiodata } = require('../models');

const read = async (req, res) => {
  let user = {};

  try {
    userGames.findOne({
      where: { id: req.params.id },
      include: {
        model: userGameBiodata,
        as: 'userGameBiodata',
      },
    }).then((results) => {
      user = {
        user_id: results.id,
        username: results.username,
        nama: results.userGameBiodata.nama,
        email: results.userGameBiodata.email,
        umur: results.userGameBiodata.umur,
        score: results.userGameBiodata.score,
      };
    });
  } catch (err) {
    return res.status(400).json(err);
  }

  if (!user) {
    return res.status(400).json({ status: 'error', message: 'user not found!' });
  } return res.status(200).json({ user });
};

const readAll = async (req, res) => {
  const users = [];

  try {
    const result = await userGames.findAll({
      raw: true,
      nest: true,
      include: {
        model: userGameBiodata,
        as: 'userGameBiodata',
      },
    });

    for (let i = 0; i < result.length; i = +1) {
      const myObj = {
        user_id: result[i].id,
        username: result[i].username,
        nama: result[i].userGameBiodata.nama,
        email: result[i].userGameBiodata.email,
        umur: result[i].userGameBiodata.umur,
        score: result[i].userGameBiodata.score,
      };
      users.push(myObj);
    }
  } catch (err) {
    return res.status(400).json(err);
  }

  if (!users) {
    return res.status(400).json({ status: 'error', message: 'no users were found!' });
  } return res.status(200).json(users);
};

module.exports = {
  read,
  readAll,
};
