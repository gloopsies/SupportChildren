import "./Create.scss";
import Web3 from 'web3';
import FundRaisings from '../../ethereum/build/contracts/FundRaisings.json';
import FundRaising from '../../ethereum/build/contracts/FundRaising.json';
import React from 'react';

export default class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {
        image_file: '',
        accounts: [],
        addr: '',
        submitting: false
      };

    this.handleImage = this.handleImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      window.location = "/admin"
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()

    this.setState({accounts})
    const networkId = await web3.eth.net.getId()
    const networkData = FundRaisings.networks[networkId]
    if (networkData) {
      const contract = new web3.eth.Contract(FundRaisings.abi, process.env.REACT_APP_CONTRACT);
      this.setState({contract})
      // Fundraisings is array of addresses of deployed Fundraising contracts
      let Fundraisings = await contract.methods.getDeployedCampaigns().call();
      this.setState({Fundraisings})
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  handleImage(event) {
    this.setState({image: event.target.value});
    this.setState({image_file: URL.createObjectURL(event.target.files[0])})
  }

  async handleSubmit(event) {
    const form = event.target;

    if (!this.state.submitting) {
      this.setState({submitting: false})
      event.preventDefault();
    }

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    const date = document.getElementById("end_date").value;
    let deadline = (new Date(date).getTime() - new Date(today).getTime()) / 15000;

    const _goal = document.getElementById("goal").value;
    const _address = document.getElementById("recipient_address").value
    const goalRegex = /([0-9]*[.])?[0-9]/
    if (!_goal.match(goalRegex)) {
      console.log("error parsing float")
      return false
    }

    const decimal = _goal.indexOf('.')

    let goalInt, goalFloat;

    if (decimal === -1) {
      goalInt = _goal;
      goalFloat = 0;
    } else {
      goalInt = _goal.substring(0, decimal);
      goalFloat = _goal.substring(decimal + 1, _goal.length);

      for (let i = goalFloat.length; i < 18; i++) {
        goalFloat = `${goalFloat}0`;
      }
    }
    
    alert("Please don't close page until transaction is finished");

    await this.state.contract.methods.createCampaign(deadline, goalInt, goalFloat, _address).send({from: this.state.accounts[0]});
    let Campaigns = await this.state.contract.methods.getDeployedCampaigns().call();
    const addr = Campaigns[Campaigns.length - 1]
    this.setState({addr})
    const web3 = window.web3;
    const contract1 = new web3.eth.Contract(FundRaising.abi, addr);
    await contract1.methods.goal().call();
    this.setState({submitting: true})
    form.submit();
  }

  render() {
    return (
      <div className="newUser">
        <iframe title="dummyframe" name="dummyframe" id="dummyframe" style={{"display": "none"}}/>
        <h1 className="newUserTitle">Create New Fundraiser</h1>
        <form target="dummyframe" action={`${process.env["REACT_APP_BACKEND_ADDRESS"]}/fundraiser`} method="POST"
              encType="multipart/form-data" className="newUserForm" onSubmit={this.handleSubmit}>

          <div className="newUserItem">
            <label>Name *</label>
            <input
              id="name"
              name="name"
              placeholder="Name"
              type="text"
              maxLength="20"
              required
            />
          </div>

          <div className="newUserItem">
            <label>Recipient address *</label>
            <input
              id="recipient_address"
              name="recipient_address"
              placeholder="Address"
              type="text"
              maxLength="1000"
              required
            />
          </div>

          <div className="newUserItem">
            <label>Input Goal (in ETH): *</label>
            <input
              id="goal"
              name="goal"
              placeholder="Desired Amount"
              type="number"
              min="0"
              max="1e9"
              step=".000000001"
              required
            />
          </div>

          <div className="newUserItem">
            <label>Expiration date *</label>
            <input
              id="end_date"
              name="end_date"
              placeholder="Date"
              type="date"
              required
            />
          </div>

          <div className="newUserItem">
            <label>Description (optional)</label>
            <textarea className="createTextArea"
                      id="description"
                      name="description"
                      placeholder="Description"
                      maxLength="500"
                      rows="6"
            />
          </div>

          <div className="newUserItem">
            <label>Choose File *</label>
            <div>
              <input className="adminCreateChooseFile"
                     id="image"
                     name="image"
                     type="file"
                     accept="image/png, image/gif, image/jpeg, image/jpg"
                     onChange={this.handleImage}
                     required/>
              {
                this.state.image_file ?
                  <img src={this.state.image_file} className="adminCreateShowImage" alt=""/> :
                  <></>
              }
            </div>
          </div>

          <div className="newUserItem">
            <label>Select Category *</label>
            <select id="category" name="category" required>
              <option disabled hidden>Select Category</option>
              <option value="0">Health</option>
              <option value="1">Education</option>
              <option value="2">Empowerment</option>
              <option value="3">Employment</option>
              <option value="4">Arts and Culture</option>
              <option value="5">Human and Civil rights</option>
              <option value="6">Religion</option>
            </select>
          </div>

          <input type="text" id="contract_address" name='contract_address' value={this.state.addr}
                 readOnly style={{"display": "none"}}/>

          <div className="newUserItem_">
            <center>
              <input type="submit" className="newUserButton" value="Create"/>
            </center>
          </div>
        </form>
      </div>
    );
  }
}