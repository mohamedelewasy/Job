const router = require("express").Router();
const auths = require("../controllers/auth");

router.route("/login").post(auths.login);
router.route("/register").post(auths.register);

module.exports = router;
