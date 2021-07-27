import "./Users.scss";
import {DataGrid} from "@material-ui/data-grid";
import {userRows} from "../../hardcodeData";

export default function UserList() {
  const data = userRows;

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100
    },
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row.username}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 220
    },
    {
      field: "fundraiser",
      headerName: "Fundraiser",
      width: 220
    },
    {
      field: "transaction",
      headerName: "Transactions Volume",
      width: 220,
    }
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </div>
  );
}
