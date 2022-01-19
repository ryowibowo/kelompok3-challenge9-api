const { UserGameBiodata } = require('../models');
const rps = require('../controller/rps');

const mockResponse = () => {
  const res = {};

  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);

  return res;
}

jest.mock('../models/index.js', () => ({
  // tulis semua fungsi yg hasil pemanggilannya ingin dipalsukan
  UserGameBiodata: {
    findOne: jest.fn(),
    update: jest.fn(),
  }
})
);

const mockRequest = (body = {}) => {
  return { body}
};


describe('rps function', () => {
  test('success', async () => {
    const req = mockRequest({
      result: 'win',
      id: '10',
      username: 'test',
    });
    const res = mockResponse();
    UserGameBiodata.findOne.mockResolvedValueOnce({ username:'test',id:'10',score: 0 })
    UserGameBiodata.update.mockResolvedValueOnce({})

    await rps(req, res);

    expect(res.json).toBeCalledWith({
      status: 'success',
      username: 'test',
      hasilSuit: 'win',
      score: '1',
    })
    expect(res.status).toBeCalledWith(200);
  });
});