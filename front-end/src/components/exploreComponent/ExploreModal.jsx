import React, {useState} from 'react';
import './ExploreModal.scss'
import {Button, Modal} from "react-bootstrap";
import {DateTime, Interval} from "luxon";
import Web3 from 'web3';
import FundRaising from '../../ethereum/build/contracts/FundRaising.json';
import FundRaisings from '../../ethereum/build/contracts/FundRaisings.json';
import axios from "axios";

export default function ExploreModal({showModal, setShowModal, fundraiser}) {
  const end = DateTime.fromISO(fundraiser.end_date);
  const today = DateTime.now();
  const i = Interval.fromDateTimes(today, end);
  const CurrGoal = +fundraiser.raisedAmount;

  const [UpdGoal, setUpdGoal] = useState(CurrGoal);

  const modalClose = () => setShowModal(false);
  const updateGoal = (event) => {
    setUpdGoal(CurrGoal + Number(event.target.value));
  }

  const donate = async () => {
    alert("Please don't close modal until transaction is finished");

    const email = document.getElementById('e-mail').value;
    const _goal = document.getElementById("donation").value;
    const goalRegex = /([0-9]*[.])?[0-9]/
    if (!_goal.match(goalRegex)) {
      console.log("error parsing float")
      return false
    }

    const decimal = _goal.indexOf('.')

    let donation, goalInt, goalFloat;

    if (decimal === -1) {
      goalInt = _goal
      goalFloat = "0"
    } else {

      goalInt = _goal.substring(0, decimal);
      goalFloat = _goal.substring(decimal + 1, _goal.length);
    }

    for (let i = goalFloat.length; i < 18; i++) {
      goalFloat = `${goalFloat}0`;
    }
    donation = `${goalInt}${goalFloat}`

    // Load Web3 
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      window.location = "/Explore"
    }
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId()
    const networkData = FundRaisings.networks[networkId]
    if (networkData) {
      const contract = new web3.eth.Contract(FundRaising.abi, fundraiser.contract_address);
      let contribution = await contract.methods.contribute().send({from: accounts[0], value: donation});

      await axios.post(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/transaction`, {
        value: donation, email: email, fundraiser: fundraiser.contract_address, transaction: contribution.transactionHash
      })

      if (contribution) {
        if (contribution.events.GoalReached) {
          const response = await axios.post(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/done`, `${fundraiser.contract_address}`)
          console.log(response)
        }
      } else {
        return
      }
    }
    modalClose()
  }

  return (
    <>
      {showModal ? (
        <Modal show={showModal} onHide={modalClose}
               size="lg"
               aria-labelledby="contained-modal-title-vcenter"
               centered
               className='modal'
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div className='title'>{fundraiser.name} (<span>{fundraiser.category === 0 ? "Health" :
                fundraiser.category === 1 ? "Education" :
                  fundraiser.category === 2 ? "Empowerment" :
                    fundraiser.category === 3 ? "Employment" :
                      fundraiser.category === 4 ? "Arts and Culture" :
                        fundraiser.category === 5 ? "Human and Civil Rights" : "Religion"}</span>)
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modalBody">
              <img
                src={`${process.env["REACT_APP_BACKEND_ADDRESS"]}/images/${fundraiser.image}`}
                alt={fundraiser.name}
              />
              <p>
                {fundraiser.description}
              </p>
            </div>
          </Modal.Body>
          <Modal.Body>
            <div className="modalBody2">
              <svg width="700" height="10">
                <rect width="700" height="20" fill="lightblue" rx="0" ry="0"/>
                <rect width={7 * Math.floor((UpdGoal * 100) / fundraiser.goal)} height=" 10" fill="lightgreen" rx="0"
                      ry="0"/>
                <rect width={7 * Math.floor((CurrGoal * 100) / fundraiser.goal)} height=" 10" fill="darkblue" rx="0"
                      ry="0"/>
              </svg>
              {UpdGoal !== CurrGoal ?
                <div className="info">
                  {UpdGoal >= fundraiser.goal ?
                    <h3 style={{color: "blue"}}><b>
                      {UpdGoal} </b></h3>
                    :
                    <h3 style={{color: "green"}}><b>
                      {UpdGoal} </b></h3>
                  }
                  <h3><b>/ {fundraiser.goal} ETH</b></h3>
                </div>
                :
                <h3><b>{CurrGoal} / {fundraiser.goal} ETH </b></h3>
              }
              {UpdGoal !== CurrGoal ?
                <div className="info">
                  <h3>
                    {i.length('days').toFixed(0)} days left
                  </h3>
                  {UpdGoal >= fundraiser.goal ?
                    <h3 style={{color: "blue"}}>
                      ({Math.floor((UpdGoal * 100) / fundraiser.goal)}%)
                    </h3>
                    :
                    <h3 style={{color: "green"}}>
                      ({Math.floor((UpdGoal * 100) / fundraiser.goal)}%)
                    </h3>
                  }
                </div>
                :
                <h3>{i.length('days').toFixed(0)} days left
                  ({Math.floor((CurrGoal * 100) / fundraiser.goal)}%)</h3>
              }

            </div>
          </Modal.Body>
          <Modal.Footer>
            <input
              id="e-mail"
              className='inputBid'
              placeholder="e-mail"
              type="text"
              maxLength="30"
            />
            <input
              id="donation"
              className='inputBid'
              placeholder="Input your donation (in ETH)"
              type="number"
              min="0"
              max="1e9"
              step=".000000001"
              onChange={updateGoal}
            />
            <Button variant="primary" onClick={() => donate()}>
              Donate
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};
  