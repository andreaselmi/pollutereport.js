const logger = require("../helpers/logger");

const error = (err, req, res, next) => {
  logger.error(err.message, { metadata: err.stack });

  return res.status(500).send("Something failed.");
};

module.exports = error;
