import React from 'react'
import './Transactions.scss';
import {useState, useEffect} from "react";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let ok = await axios.get(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/transactions`);
        if(ok.data === null) return;
        setTransactions(ok.data);
      } catch (err) {
        console.log(err)
      }
    }

    fetchData().then(() => {
    });
  }, [])

  const Button = ({type}) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  const ethToFloat = (v => {
    for (let i = v; i < 18; i++) {
      v = `0${v}`
    }

    return +(v.slice(0, v.length-18) + "." + v.slice(v.length-18));
  })

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tbody>
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Fundraiser</th>
          <th className="widgetLgTh">E-mail</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {transactions.map( e => (
          <tr key={e.transaction}>
            <td className="widgetLgUser">
            <span className="widgetLgName">{e.fundraiser}</span>
            </td>
            <td className="widgetLgMail">{e.email.length > 0? e.email : "Anonymous"}</td>
            <td className="widgetLgDate">{e.created_at}</td>
            <td className="widgetLgAmount">{ethToFloat(e.value)} ETH</td>
            <td className="widgetLgStatus">
              <Button type="Approved"/>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );

}
