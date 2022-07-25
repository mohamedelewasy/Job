const router = require("express").Router();
const jobs = require("../controllers/jobs");
const { jobBelongsToUser } = require("../middleware/authentication");
// يوسف الحسيني
router.route("/all").get(jobs.getAllJobs);
router
  .route("/:id")
  .get(jobs.getJob)
  .patch(jobs.updateJob)
  .delete(jobs.deleteJob);
// .get(jobBelongsToUser, jobs.getJob)
// .patch(jobBelongsToUser, jobs.updateJob)
// .delete(jobBelongsToUser, jobs.deleteJob);
router.route("/create").post(jobs.createJob);

module.exports = router;
