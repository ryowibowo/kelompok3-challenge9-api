const auth = require('../controller/auth');
const update = require('../controller/update')
const { encrypt } = require('../lib/hashing')
const { checkPW } = require('../lib/checkPW')
const { UserGames, UserGameBiodata } = require('../models')

const mockRequest = (body = {}) => {
    return { body }
};

const mockResponse = () => {
    const res = {};

    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    return res;
}

jest.mock('../models/index.js', () => ({
    // tulis semua fungsi yg hasil pemanggilannya ingin dipalsukan
    UserGames: {
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    UserGameBiodata: {
        findOne: jest.fn(),
        update: jest.fn(),
    }
  })
);

jest.mock('../lib/checkPW', () => ({
    checkPW: jest.fn(),
}));

jest.mock('../lib/hashing', () => ({
    encrypt: jest.fn(),
}));

describe('auth.register function', () => {
    test('res.json called with { status: error, message: "blank username or password" }', async () => {
        const req = mockRequest({ username: '', password: '', email: 'asd', nama: 'asd', umur: 24, score: 0});
        const res = mockResponse();

       await auth.register(req, res);

        expect(res.status).toBeCalledWith(409);
        expect(res.json).toBeCalledWith({
            status:'error',
            message: 'blank username or password'
        });
    });

    test('res.json called with { status: error, message: "Username Telah Terdaftar" }', async () => {
        const req = mockRequest({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0});
        const res = mockResponse();
        UserGames.findOne.mockResolvedValueOnce({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0})

        await auth.register(req, res);

        expect(res.status).toBeCalledWith(409);
        expect(res.json).toBeCalledWith({
            status:'error',
            message: 'Username Telah Terdaftar'
        });
    });

    test('res.json called with { status: error, message: "Email Telah Terdaftar" }', async () => {
        const req = mockRequest({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0});
        const res = mockResponse();
        UserGameBiodata.findOne.mockResolvedValueOnce({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0})

        await auth.register(req, res);

        expect(res.status).toBeCalledWith(409);
        expect(res.json).toBeCalledWith({
            status:'error',
            message: 'Email Telah Terdaftar'
        });
    });

    test('res.json called with { status: success, message: "Register Berhasil" }', async () => {
        const req = mockRequest({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0});
        const res = mockResponse();
        UserGames.findOne.mockResolvedValueOnce()
        UserGameBiodata.findOne.mockResolvedValueOnce()
        UserGames.findOne.mockResolvedValueOnce({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0})
        await auth.register(req, res);

        expect(res.status).toBeCalledWith(202);
        expect(res.json).toBeCalledWith({
            status:'success',
            message: 'Register Berhasil'
        });
    });
});

