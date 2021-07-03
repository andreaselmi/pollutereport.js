const logger = require("../helpers/logger");

const error = (err, req, res, next) => {
  logger.info(err.message, { metadata: err.stack });

  return res.status(500).send("Something goes wrong.");
};

module.exports = error;
