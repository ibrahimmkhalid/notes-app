function responseHelper(res, callback) {
  callback()
    .then((data) => {
      res.json({
        status: 'success',
        data: data ? data : null
      });
    })
    .catch((error) => {
      let code = error.code ? error.code : 500;
      delete error.code;
      res.status(code).json({
        status: 'fail',
        error: error
      });
    })
}

module.exports = responseHelper;
