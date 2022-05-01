const Employee = require("../model/FunFacts");
const states = require("../data/states.json");
const { find, startSession } = require("../model/FunFacts");

const getAllStates = async (req, res) => {
  if (req?.query?.contig === undefined) {
    res.json(states);
  } else {
    console.log(req?.query?.contig);
    const result = await findStatesByContiguity(req.query.contig);
    res.json(result);
  }
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and Last names are required." });
  }

  try {
    const result = Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (err) {
    console.err(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID Parameter is required." });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employee matches ID ${req.body.id}.` });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res
      .status(400)
      .json({ message: "Employee ID Parameter is required." });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employee matches ID ${req.body.id}.` });
  }

  const result = await employee.deleteOne({ _id: req.body.id });

  res.json(result);
};
const getState = async (req, res) => {
  if (!req?.params?.state) {
    return res.status(400).json({ message: "State Parameter is required." });
  }
  let state = await findState(req.params.state);

  if (!state) {
    return res
      .status(404)
      .json({ message: `Invalid state abbreviation parameter` });
  }

  res.json(state);
};

const getStateCapital = async (req, res) => {
  if (!req?.params?.state) {
    return res.status(400).json({ message: "State Parameter is required." });
  }
  let state = await findState(req.params.state);

  if (!state) {
    return res
      .status(404)
      .json({ message: `Invalid state abbreviation parameter` });
  }

  res.json({
    state: state.state,
    capital: state.capital_city,
  });
};

const getStateNickname = async (req, res) => {
  if (!req?.params?.state) {
    return res.status(400).json({ message: "State Parameter is required." });
  }
  let state = await findState(req.params.state);

  if (!state) {
    return res
      .status(404)
      .json({ message: `Invalid state abbreviation parameter` });
  }

  res.json({
    state: state.state,
    nickname: state.nickname,
  });
};

const getStatePopulation = async (req, res) => {
  if (!req?.params?.state) {
    return res.status(400).json({ message: "State Parameter is required." });
  }
  let state = await findState(req.params.state);

  if (!state) {
    return res
      .status(404)
      .json({ message: `Invalid state abbreviation parameter` });
  }

  res.json({
    state: state.state,
    population: state.population,
  });
};

const getStateAdmission = async (req, res) => {
  if (!req?.params?.state) {
    return res.status(400).json({ message: "State Parameter is required." });
  }
  let state = await findState(req.params.state);

  if (!state) {
    return res
      .status(404)
      .json({ message: `Invalid state abbreviation parameter` });
  }

  res.json({
    state: state.state,
    admitted: state.admission_date,
  });
};

const findState = async (code) => {
  let result = null;
  states.forEach((state) => {
    if (state.code === code.toUpperCase()) {
      result = state;
    }
  });
  return result;
};

const findStatesByContiguity = async (isContiguous) => {
  // console.log(typeof isContiguous)
  // console.log(isContiguous);
  let result = [];
  states.forEach((state) => {
    if (isContiguous === 'true') {
      if (state.code !== "AK" && state.code !== "HI") {
        // console.log(state.code);
        result.push(state);
      }
    } else if (state.code === "AK" || state.code === "HI") {
      // console.log(state.code);
      result.push(state);
    }
  });
  return result;
};

module.exports = {
  getAllStates,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getState,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmission,
};
