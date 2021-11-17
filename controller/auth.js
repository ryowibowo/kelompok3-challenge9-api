// import bcrypt untuk menyimpan & mengecek password dengan cara yg aman
const bcrypt = require('bcrypt');

// import jwt untuk membuat token
const jwt = require('jsonwebtoken');

const { user_games, user_game_biodata } = require('../models');

// method untuk menyimpan password dalam bentuk hash
const encrypt = (password) => {
    return bcrypt.hashSync(password, 10);
}

// method untuk membandingkan password dalam bentuk hash & plain text
const checkPassword = (password, encryptedPassword, ) => {
    return bcrypt.compareSync(password, encryptedPassword);
}

// method untuk membuat token jwt
const generateToken = (user) => {
    // Jangan memasukkan password ke dalam payload
    const payload = {
        id: user.id,
        username: user.username,
    }

    // Rahasia ini nantinya kita pakai untuk memverifikasi apakah token ini benar-benar berasal dari aplikasi kita
    const rahasia = process.env.SECRET_KEY;

    // Membuat token dari data-data diatas
    return jwt.sign(payload, rahasia);
}

// method untuk membuat response setelah register
const format = (user) => {
    const { id, username, role } = user
    return {
        id,
        username,
        accessToken: generateToken(user)
    }
}

// controller register
const register = async(req, res) => {
    // ambil username, password, dan role dari request body
    const { username, password, nama, email, umur } = req.body;

    try {
        // cek apakah user sudah ada
        const user = await user_games.findOne({
            where: { username }
        });

        // jika user ditemukan
        if (user) {
            return res.json('Username Telah Terdaftar');
        }

    } catch (err) {
        return res.json(err);
    }

    try {
        const data = await user_game_biodata.findOne({
            where: { email }
        })

        if (data) {
            return res.json('E-mail sudah terdaftar')
        }
    }
    catch(err) {
        return res.json(err)
    }

    try {
        // mengubah password menjadi hash
        const encryptedPassword = encrypt(password);

        // buat user di tabel
        const user = await user_games.create({
            username,
            password: encryptedPassword,
            user_game_biodata: {
                nama,
                email,
                umur,
                score: 0,
            },
        }, {
            include: {
                model: user_game_biodata,
                as: 'user_game_biodata',
            },
        });

        const result = {
            status: "success",
            message: "Register Berhasil",
            data: user
        };
        return res.json(result);

    } catch (err) {
        return res.json({
            status: "failed",
        })

    }
}

// controller login
const login = async(req, res) => {
    // ambil username dan password dari request body
    const { username, password } = req.body;

    // siapkan variable penampung user
    let user = {};

    try {
        // cari user berdasar username
        user = await user_games.findOne({
            where: { username }
        })
    } catch (err) {
        return res.json(err);
    }

    // cek apakah user tidak ditemukan
    if (!user) {
        const result = {
            status: "Failed",
            message: "User Tidak Ditemukan"
        };
        return res.json(result);
    }

    // bandingkan password dari request body dengan dari database
    const isPasswordValid = checkPassword(password, user.password);

    // jika tidak sesuai
    if (!isPasswordValid) {
        const result = {
            status: "Failed",
            message: "Password Salah"
        };
        return res.json(result);
    }

    // jika sesuai
    const result = {
        status: "Success",
        message: "Login Berhasil",
        accessToken: generateToken(user)
    };
    return res.json(result);
}

module.exports = {
    register,
    login,
}