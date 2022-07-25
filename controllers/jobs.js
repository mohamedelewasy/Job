const { BadRequestError, NotFoundError } = require("../errors/index");
const jobModel = require("../models/Job");
const getJob = async (req, res) => {
  const jobs = await jobModel.find({
    createdBy: req.user.userId,
    _id: req.params.id,
  });
  res.json({ jobs });
};

const createJob = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;
    const job = await jobModel.create(req.body);
    res.json({ job });
  } catch (error) {
    throw new BadRequestError("server error, can't create a job");
  }
};

const updateJob = async (req, res) => {
  try {
    await jobModel.findByIdAndUpdate(
      { _id: req.params.id, createdBy: req.body.userID },
      req.body,
      {
        runValidators: true,
      }
    );
    const newJob = await jobModel.findById(req.params.id);
    res.json({ newJob });
  } catch (error) {
    throw new BadRequestError("server error, can't update a job");
  }
};

const deleteJob = async (req, res) => {
  try {
    await jobModel.find({ _id: req.params.id }).remove();
    res.status(200).json({ msg: "job removed successfully" });
  } catch (error) {
    throw new BadRequestError("server error, can't update a job");
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel
      .find({ createdBy: req.user.userId })
      .sort("-createdAt");
    res.json({ jobs });
  } catch (error) {
    throw new Error("server error, can't get all jobs");
  }
};

module.exports = {
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
};
