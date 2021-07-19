import React, { useEffect, useState } from 'react';

import web3 from './instances/connection';
import getDStorage from './instances/contracts';
import Navbar from './components/Layout/Navbar';
import Main from './components/Content/Main'
import box from './img/box.png';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const App = () => {
  const [dstorage, setDstorage] = useState(null);
  const [account, setAccount] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [capturedFileBuffer, setCapturedFileBuffer] = useState(null);
  const [capturedFileType, setCapturedFileType] = useState(null);
  const [capturedFileName, setCapturedFileName] = useState(null);

  useEffect(() => {
    if(!web3) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    }
    
    const loadBlockchainData = async() => {
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });  
      } catch(error) {
        console.error(error);
      }
      
      // Load account
      const accounts = await web3.eth.getAccounts();       
      setAccount(accounts[0]);

      // Network ID
      const networkId = await web3.eth.net.getId()

      // Contract
      const contract = getDStorage(networkId);
      if(contract) {
        // Set contract in state
        setDstorage(contract);        
        // Get files amount
        const filesCount = await contract.methods.fileCount().call();
        // Load files&sort by the newest
        for (let i = filesCount; i >= 1; i--) {
          const file = await contract.methods.files(i).call();
          setFiles(prevState => {
            return [...prevState, file];
          });
        }

        setIsLoading(false);

        // Event subscription
        contract.events.FileUploaded({}, (error, event) => {        
          const file = event.returnValues;
          setFiles(prevState => {
            return [file, ...prevState];
          })
          setIsLoading(false);
        });
      } else {
        window.alert('DStorage contract not deployed to detected network.')
      }
    };
    
    loadBlockchainData();    
  }, []);

  // Get file from user
  const captureFile = event => {
    event.preventDefault();

    const file = event.target.files[0];

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setCapturedFileBuffer(Buffer(reader.result));
      setCapturedFileType(file.type);
      setCapturedFileName(file.name);      
    }      
  };

  // Upload file to IPFS and push to the blockchain
  const uploadFile = async(description) => {
    // Add file to the IPFS
    const fileAdded = await ipfs.add(capturedFileBuffer);
    if(!fileAdded) {
      console.error('Something went wrong when updloading the file');
      return;
    }

    // Assign value for the file without extension
    if(capturedFileType === ''){
      setCapturedFileType('none');
    }

    dstorage.methods.uploadFile(fileAdded.cid.string, fileAdded.size, capturedFileType, capturedFileName, description).send({ from: account })
    .on('transactionHash', (hash) => {
      setIsLoading(true);
      setCapturedFileType(null);
      setCapturedFileName(null);
    })
    .on('error', (e) =>{
      window.alert('Something went wrong when pushing to the blockchain');
      setIsLoading(false);  
    })
  };

  const showContent = web3 && account && dstorage;

  return (    
    <React.Fragment>
      <Navbar account={account} web3={web3} setAccount={setAccount} />
      <img src={box} className="rounded mx-auto d-block mt-3" width="120" height="120" alt="logo" />
      {showContent && <Main files={files} captureFile={captureFile} uploadFile={uploadFile} isLoading={isLoading} />}
    </React.Fragment>
  );
};

export default App;