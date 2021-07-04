const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID");

  //TODO valutare se inserire la validazione del body
  // if (req.body.id && !mongoose.Types.ObjectId.isValid(req.body.id))
  //   return res.status(404).send("Invalid ID");

  next();
};
