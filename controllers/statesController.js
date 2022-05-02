const FunFacts = require("../model/FunFacts");
const states = require("../data/states.json");

const getAllStates = async (req, res) => {
  let result;
  if (req?.query?.contig === undefined) {
    result = [...states]; // use the spread operator to create a non-const copy.
  } else {
    result = await findStatesByContiguity(req.query.contig);
  }
  result.forEach(async (state) => {
    // look for the state in the DB
    const stateExists = await FunFacts.findOne({ stateCode: state.code }).exec();
    if (stateExists) {
      state.funfacts = [...stateExists.funfacts];
    }
  });
  res.json(result);
};

const getFunFacts = async (req, res) => {
  const facts = await FunFacts.findOne({ stateCode: req.code }).exec();

  if (!facts) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${req.name}` });
  }
  const randIndex = Math.floor(Math.random() * facts.funfacts.length);
  console.log(randIndex);

  res.json({ funfact: `${facts.funfacts[randIndex]}` });
};

const createNewFunFacts = async (req, res) => {
  if (!req?.body?.funfacts) {
    return res
      .status(400)
      .json({ message: "State fun facts value required"});
  }

  const facts = await FunFacts.findOne({ stateCode: req.code }).exec();
  let result;
  if (!facts) {
    result = await FunFacts.create({
      stateCode: req.code,
      funfacts: req.body.funfacts,
    });
    console.log(result);
  } else {
  facts.funfacts = [...facts.funfacts, ...req.body.funfacts];
  result = await facts.save();
  }
  res.json(result);
};

const updateFunFacts = async (req, res) => {
  if (!req?.body?.index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  if (!req?.body?.funfact) {
    return res
      .status(400)
      .json({ message: "State fun fact value required"});
  }
  const index = req.body.index-1;
  const facts = await FunFacts.findOne({ stateCode: req.code }).exec();
  
  if (!facts) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${req.name}` });
  }

  facts.funfacts[index] = req.body.funfact;
  console.log(facts); 
  const result = await facts.save();

  res.json(result);
};

const deleteFunFacts = async (req, res) => {
  if (!req?.body?.index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  const index = req.body.index-1;
  const facts = await FunFacts.findOne({ stateCode: req.code }).exec();

  console.log(facts.funfacts);
  if (!facts) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${req.name}` });
  }

  fact = facts.funfacts[index];
  facts.funfacts.splice(index, 1);

  console.log(facts);
  
  const result = await facts.save();
  res.json(result);
};

const getState = async (req, res) => {
  let state = await findState(req.code);
    // look for the state in the DB
    const stateExists = await FunFacts.findOne({ stateCode: state.code }).exec();
    if (stateExists) {
      state.funfacts = [...stateExists.funfacts];
    }
    res.json(state);
};

const getStateCapital = async (req, res) => {
  let state = await findState(req.code);
  res.json({
    state: state.state,
    capital: state.capital_city,
  });
};

const getStateNickname = async (req, res) => {
  let state = await findState(req.code);
  res.json({
    state: state.state,
    nickname: state.nickname,
  });
};

const getStatePopulation = async (req, res) => {
  let state = await findState(req.code);
  res.json({
    state: state.state,
    population: state.population,
  });
};

const getStateAdmission = async (req, res) => {
  let state = await findState(req.code);
  res.json({
    state: state.state,
    admitted: state.admission_date,
  });
};

const findState = async (code) => states.find(st => st.code === code);

const findStatesByContiguity = async (isContiguous) => {
  let result;
  if (isContiguous === "true") {
    result = states.filter((st) => st.code !== "AK" && st.code !== "HI");
  } else {
    result = states.filter((st) => st.code === "AK" || st.code === "HI");
  }
  return result;
};

module.exports = {
  getAllStates,
  getFunFacts,
  createNewFunFacts,
  updateFunFacts,
  deleteFunFacts,
  getState,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmission,
};
