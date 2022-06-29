import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import './App.css';

// Contract address
const greeterAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

function App() {
  // State 
  const [greetingMessage, setGreetingMessage] = useState("");
  const [dataFromBlockchain, setDataFromBlockchain] = useState("");

  // Smart contract interaction using helper functions
  // For metamask wallet account access 
  async function requestAccount() {
    await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
  }
  // getting the current greeting value
  async function getGreeting() {
    // checking whether the metamask wallet is found/exits
    if (typeof window.ethereum !== 'undefined') {
      // creating a new provider 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // creating a contract 
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        /* accessing the value of greeting in the 
        blockchain (from the deployed smart contract)
         function Greeter.greet() } */
        const data = await contract.greet();
        console.log("Fetched data: ", data);
        setDataFromBlockchain(data);
      } catch (error) {
        console.log("Error :", error);
      }
    }
  }
  // Set function
  async function setGreeting() {
    // Check if the greeting message exists
    if (!greetingMessage) return;
    // checking whther the metamask wallet is found/exits
    if (typeof window.ethereum !== 'undefined') {
      // access wallet - requesting account
      await requestAccount();
      // creating a new provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // for a setting function, getting signer is required, 
      // to sign the transaction using their private key
      const signer = provider.getSigner();
      // creating a contract with signer
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      // creating transaction
      const transaction = await contract.setGreeting(greetingMessage);
      // setting State for the new message
      setGreetingMessage("");
      // transaction happening
      await transaction.wait();
      // calling the getter [getGreeting function] with the new greeting message
      getGreeting();
    }
  }

  return (
    <div className="App">

      <div className="App-header">
        <h1>Dapp - Using React and Hardhat</h1>
        {/* creating  ui for fetching message and setting message*/}
        <div className="get-greeting">
          <button
            onClick={getGreeting}>
            Get Greeting
          </button>
          <span>'{dataFromBlockchain}'</span>
        </div>
        <div className="set-greeting">
          <input
            type="text"
            placeholder='Please enter a greeting'
            onChange={(evt) => setGreetingMessage(evt.target.value)}
            value={greetingMessage} />
          <button
            className="set-button"
            onClick={setGreeting}>
            Set Greeting
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;
