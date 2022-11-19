// import logo from './logo.svg';
import './App.css';
import { mintContract } from './contracts/mint';
import { useState } from "react"
function App() {

  const [address, setAddress] = useState('');

  const connect = () => {
    if (window.ethereum) {
      window.ethereum.request({
        method: "eth_requestAccounts",
      }).then((result) => {
        setAddress(result[0])
      })
    } else console.log('install metamask first')
  }


  const mint = async () => {
    try {
      const res = await mintContract.methods.mint().send({ from: address })
      console.log(res)
    } catch (err) {
      console.log('err', err)
    }
  }


  return (
    <div className="App">
      <button onClick={connect} >연결</button>
      <button onClick={mint} >민팅</button>
    </div>
  );
}

export default App;
