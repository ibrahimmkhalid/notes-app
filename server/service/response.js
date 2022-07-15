function responseHelper(res, callback) {
  callback()
    .then((data) => {
      res.json({data});
    })
    .catch((error) => {
      res.status(500).json({error});
    })
}

module.exports = responseHelper;
