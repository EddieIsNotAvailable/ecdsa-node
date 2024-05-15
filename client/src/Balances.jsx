import server from "./server";
import {useState, useEffect} from "react";

function Balances({balanceChanged}) {
  const [balances, setBalances] = useState({});
  const [notification, setNotification] = useState("");

  async function fetchBalances() {
    const {data} = await server.get("balances");
    setBalances(data);
  }

  useEffect(() => {
    fetchBalances();
  }, [balanceChanged]);

  function copyToClipboard(address) {
    navigator.clipboard.writeText(address);
    setNotification("Address Copied");
    setTimeout(() => setNotification(""), 2000);
  }

  return (
    <div className="container balances">
      <h1>Balances</h1>
      {notification && <p>{notification}</p>}
      <p>Click address to copy</p>
      <table>
        <thead>
        <tr>
          <th>Address</th>
          <th>Balance</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(balances).map(([address, balance]) => (
          <tr key={address}>
            <td onClick={() => copyToClipboard(address)}
                style={{cursor: "pointer"}}

            >{address.slice(0, 10)}...
            </td>
            <td>{balance}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default Balances;