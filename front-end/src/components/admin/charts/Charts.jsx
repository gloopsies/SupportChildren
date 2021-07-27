import React, {useEffect, useState} from 'react'
import './Charts.scss'
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis} from 'recharts';
import axios from "axios";
import {DateTime} from "luxon";

export default function Charts({title, dataKey, grid}) {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let ok = await axios.get(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/transactions`);

        if(ok.data === null) return;

        for (let e of ok.data) {
          e.id=e.transaction;
        }
        setTransactions(ok.data);
      } catch (err) {
      }
    }

    fetchData().then(() => {
    });
  }, [])

  const getData = (day) => {
    return {
      day: `${day}`,
      price: transactions.reduce((eth, transaction) => {
        const date = DateTime.fromISO(transaction.created_at);

        if (+date.diffNow('days').days.toFixed(0) !== -day + 7) return 0;

        let v = transaction.value;
        for (let i = v; i < 18; i++) {
          v = `0${v}`
        }

        return +(v.slice(0, v.length-18) + "." + v.slice(v.length-18));
      }, 0)
    }
  }

  let data = [
    getData(1),
    getData(2),
    getData(3),
    getData(4),
    getData(5),
    getData(6),
    getData(7),
  ]

  return (
    <div className="adminChart">
      <h3 className="chartTitle">{title} (ETH)</h3> 
      <ResponsiveContainer width="98%" aspect={4}>
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#5550bd"/>
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd"/>
          <Tooltip/>
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5"/>}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
