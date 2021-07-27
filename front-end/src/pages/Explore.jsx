import React, {useEffect, useState} from "react";
import Web3 from 'web3';
import Fundraiser from "../components/exploreComponent/ExploreFundraiser";
import FilterSidebar from "../components/exploreComponent/ExploreSidebar";

import FundRaisings from '../ethereum/build/contracts/FundRaisings.json';
import FundRaising from '../ethereum/build/contracts/FundRaising.json';

import "./Explore.scss";

const Explore = () => {
  const [fundraisers, setFunds] = useState([]);
  const [searchBar, setSearchBar] = useState('');
  const [filter, setFilter] = useState({
    option: "0",
    dir: true,
    category: [],
    start_date: "1901-01-01T00:00:00Z",
    end_date: "2901-01-01T00:00:00Z",
    start_price: "0",
    end_price: "1000000000"
  });

  const updFilter = (newFilter) => setFilter({...filter, ...newFilter});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/fundraisers`, {method: "GET"});
        const json = await response.json();
        await loadWeb3();
        const data = await loadBlockchainData(json);

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

  console.log(fundraisers);

  return (
    <div className="container">
      <div className="header">
        <FilterSidebar filter={filter} setFilter={updFilter}/>
      </div>
      <div className="fundraisers">
        <input
          type="search"
          placeholder="Search..."
          autoComplete="off"
          onChange={event => (setSearchBar(event.target.value))}
        />
        <div className="cards">
          {fundraisers.filter(
            (val) => {
              if (!val.name.toLowerCase().includes(searchBar.toLowerCase()))
                return false;
              if (filter.category.length !== 0 && !filter.category.includes(val.category))
                return false;
              if (val.created_at.localeCompare(filter.start_date) < 0 && filter.start_date !== "T00:00:00Z")
                return false;
              if (val.end_date.localeCompare(filter.end_date) > 0 && filter.end_date !== "T00:00:00Z")
                return false;
              if (val.goal.localeCompare(filter.start_price) < 0 && filter.start_price !== '')
                return false;
              if (val.goal.localeCompare(filter.end_price) > 0 && filter.end_price !== '')
                return false;

              return true;
            }
          ).sort((a, b) => {
            let x;
            switch (filter.option) {
              case "0":
                x = (a.created_at < b.created_at) ? 1 : -1;
                break;
              case "1":
                x = (a.end_date < b.end_date) ? 1 : -1;
                break;
              case "2":
                x = (a.goal < b.goal) ? 1 : -1;
                break;
              case "3":
                x = (a.goal - a.raisedAmount < b.goal - b.raisedAmount) ? 1 : -1;
                break;
              case "4":
                x = (a.raisedAmount < b.raisedAmount) ? 1 : -1;
                break;
              default:
                x = 1;
            }
            return (!filter.dir ? x : -x);
          }).map(e =>
            <Fundraiser key={e.contract_address} fundraiser={e}/>
          )}
        </div>

      </div>
    </div>
  )
};

export default Explore;