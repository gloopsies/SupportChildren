import React, {useEffect, useState} from "react";
import Web3 from 'web3';

import "./Fundraisers.scss";
import {DataGrid} from "@material-ui/data-grid";

import FundRaisings from '../../ethereum/build/contracts/FundRaisings.json';
import FundRaising from '../../ethereum/build/contracts/FundRaising.json';

export default function UserList() {
  const [fundraisers, setFunds] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/fundraisers`, {method: "GET"});
        const json = await response.json();
        await loadWeb3();
        const data = await loadBlockchainData(json);

        for (const fundraiser of data) {
          fundraiser.end_date = fundraiser.end_date.substring(0, fundraiser.end_date.length - 10);
          console.log(fundraiser.category);
          if (fundraiser.category === 0)
            fundraiser.category = "Health";
          else if (fundraiser.category === 1)
            fundraiser.category = "Education";
          else if (fundraiser.category === 2)
            fundraiser.category = "Empowerment";
          else if (fundraiser.category === 3)
            fundraiser.category = "Employment";
          else if (fundraiser.category === 4)
            fundraiser.category = "Arts and Culture";
          else if (fundraiser.category === 5)
            fundraiser.category = "Human / Civil Rights";
          else
            fundraiser.category = "Religion"
        }
        setFunds(data);
      } catch (err) {
        console.log(err)
      }
    }

    fetchData().then(() => {
    });
  }, [])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      window.location = "/explore"
    }
  }

  const loadBlockchainData = async (data) => {
    const web3 = window.web3

    const networkId = await web3.eth.net.getId()
    const networkData = FundRaisings.networks[networkId]
    if (networkData) {
      for (const fundraiser of data) {
        fundraiser.contract = new web3.eth.Contract(FundRaising.abi, fundraiser.contract_address);
        let amount = await fundraiser.contract.methods.getBalance().call();

        while (`${amount}`.length < 18) {
          amount = `0${amount}`;
        }

        let raisedInt = amount.substring(0, amount.length - 18)
        let raisedFloat = amount.substring(amount.length - 18, amount.length - 1)
        if (raisedInt.length === 0) raisedInt = "0"
        if (raisedFloat.length === 0) raisedFloat = "0"

        fundraiser.raisedAmount = `${raisedInt}.${raisedFloat}`
      }
    }

    return data
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 220,
      renderCell: (params) => {
        return (
          <div>
            {params.row.category}
          </div>
        );
      }
    },
    {
      field: "raised",
      headerName: "Raised Amount",
      width: 220,
      renderCell: (params) => {
        return (
          <div>
            {params.row.raisedAmount}
          </div>
        );
      }
    },
    {
      field: "goal",
      headerName: "Goal",
      width: 140,
      renderCell: (params) => {
        return (
          <div>
            {params.row.goal}
          </div>
        );
      }
    },
    {
      field: "date",
      headerName: "Exp. Date",
      width: 140,
      renderCell: (params) => {
        return (
          <div>
            {params.row.end_date}
          </div>
        );
      }
    }
  ];

  return (
    <div className="fundraiserList">
      <DataGrid
        rows={fundraisers}
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </div>
  );
}
