// import passport
const passport = require('passport');

// import strategy & rename it as jwtstrategy & import extractjwt
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

// import user model
const { UserGames } = require('../models');

// option ini akan digunakan dalam passport
const options = {
  // mengambil jwt dari request header bernama authorization
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),

  secretOrKey: process.env.SECRET_KEY,
};

// buat strategy jwt yg digunakan & atur optionnya
passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
    // setelah membaca jwt, cari user berdasar id ke dalam tabel user
    const user = await UserGames.findByPk(payload.id);

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
