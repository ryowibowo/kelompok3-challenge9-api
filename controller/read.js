const { UserGames, UserGameBiodata } = require('../models');

// eslint-disable-next-line consistent-return
const read = async (req, res) => {
  try {
    let user = {};
    await UserGames.findOne({
      where: { id: req.params.id },
      include: {
        model: UserGameBiodata,
        as: 'UserGameBiodata',
      },
    }).then((results) => {
      user = {
        ...user,
        user_id: results.id,
        username: results.username,
        nama: results.UserGameBiodata.nama,
        email: results.UserGameBiodata.email,
        umur: results.UserGameBiodata.umur,
        score: results.UserGameBiodata.score,
        url: results.UserGameBiodata.url,
      };
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const readAll = async (req, res) => {
  try {
    const result = await UserGames.findAll({
      raw: true,
      nest: true,
      include: {
        model: UserGameBiodata,
        as: 'UserGameBiodata',
      },
    });

    const data = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < result.length; i++) {
      const myObj = {
        user_id: result[i].id,
        username: result[i].username,
        nama: result[i].UserGameBiodata.nama,
        email: result[i].UserGameBiodata.email,
        umur: result[i].UserGameBiodata.umur,
        score: result[i].UserGameBiodata.score,
      };
      data.push(myObj);
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  read,
  readAll,
};
