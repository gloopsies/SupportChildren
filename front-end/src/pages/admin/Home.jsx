import Charts from "../../components/admin/charts/Charts";
import "./Home.scss";
import Transactions from "../../components/admin/transactions/Transactions";
import axios from "axios";
import {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/logged`, {}, {withCredentials: true});
        if (response.status !== 200) window.location = "/login"

      } catch (err) {
        window.location = "/login"
        console.log(err)
      }
    }

    fetchData().then(() => {
    });
  }, [])
  return (
    <div className="adminHome">
      <Charts title="Weekly Revenue Analytics" grid dataKey="price"/>
      <div className="adminHomeWidgets">
        <Transactions />
      </div>
    </div>
  )
}
