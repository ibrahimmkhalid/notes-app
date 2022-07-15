function responseHelper(res, callback) {
  callback()
    .then((data) => {
      res.json({
        status: 'success',
        data: data ? data : null
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 'fail',
        error: error
      });
    })
}

module.exports = responseHelper;
