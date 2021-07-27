import React, { useEffect, useState } from "react";
import "./Fundraisers.scss";
import { DataGrid } from "@material-ui/data-grid";
import axios from 'axios'
import {DateTime} from "luxon";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let ok = await axios.get(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/transactions`);
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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 500
    },
    {
      field: "fundraiser",
      headerName: "Fundraiser",
      width: 200
    },
    {
      field: "email",
      headerName: "Email",
      width: 220
    },
    {
      field: "created_at",
      headerName: "Date",
      width: 220,
      valueGetter: (obj) =>
        DateTime.fromISO(obj.row.created_at).setLocale("rs").toLocaleString(DateTime.DATETIME_FULL)
    },
    {
      field: "value",
      headerName: "Amount (ETH)",
      width: 220,
      valueGetter: (obj) => {
        let v = obj.row.value;
        for (let i = v; i < 18; i++) {
          v = `0${v}`
        }

        return +(v.slice(0, v.length-18) + "." + v.slice(v.length-18));
      }
    }
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={transactions}
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </div>
  );
}
