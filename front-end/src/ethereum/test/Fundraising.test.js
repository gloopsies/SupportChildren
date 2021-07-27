const assert = require('assert');

const FundRaising = artifacts.require("../contracts/Fundraising.sol");

contract('FundRaising', async (accounts) => {
  let instance;
  let admin = "";

  beforeEach('setup contract for each test', async function () {
    instance = await FundRaising.deployed();
    admin = accounts[0];
  })

  it("It should create a Fundraiser with goal 1000 and creator accounts[0]", async () => {
    goal = await instance.goal();
    creator = await instance.admin();
    deadline = await instance.deadline();
    assert.equal(goal, 1000, 'Goal should be 1000');
    assert.equal(creator, admin, 'Creator should be admin');
  })

  it("It should accept donations from two contributors", async () => {
    await instance.contribute({from: accounts[1], value: 100});
    await instance.contribute({from: accounts[2], value: 200});
    let totalContributions = await instance.totalContributors();
    assert.equal(totalContributions, 2, "Total contributiors should be 2")
  })

  it("It should emit Donation event", async () => {
    let contribution = await instance.contribute({from: accounts[1], value: 100});
    console.log(contribution)
    console.log(contribution.logs[0].args[1])
    assert.equal(contribution.logs[0].event, "Donation");
  })

  it("It should accept donation and total balance should be 800", async () => {
    await instance.contribute({from: accounts[1], value: 400});
    balance = await instance.getBalance();
    assert.equal(balance, 800, "Balance should be 800");
  })

  it("It should accept donation from accounts[2] and contribution of this account should be 300", async () => {
    await instance.contribute({from: accounts[2], value: 100});
    let balance = await instance.contributions(accounts[2])
    assert.equal(balance, 300, "Contributionshould be 300");
  })

  it("It should emit GoalReached event and completed should be true", async () => {
    let contribution = await instance.contribute({from: accounts[1], value: 1000});
    let completed = await instance.completed();
    assert.equal(contribution.logs[1].event, "GoalReached");
    assert.equal(completed, true, "Completed should be true")
  })

  it("It should create spending request", async () => {
    await instance.createSpendingRequest("We need 500 Wei for ...", accounts[5], 500, {from: accounts[0]});
    let request = await instance.requests(0)
    assert.equal(request.description, "We need 500 Wei for ...");
  })

  it("Should allow accounts[1], accounts[2] to vote", async () => {
    await instance.voteForRequest(0, {from: accounts[1]});
    await instance.voteForRequest(0, {from: accounts[2]});
    let request = await instance.requests(0)
    assert.equal(request.numberOfVoters, 2);
  })

  it("Shouldn't have enough fund for payment", async () => {
    try {
      await instance.makePayment(0, {from: accounts[0]});
      assert(false);
    } catch (err) {
      assert(err);
    }

  })


}) 