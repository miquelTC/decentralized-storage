import React, { useEffect, useState } from 'react';

import web3 from './instances/connection';
import getDStorage from './instances/contracts';
import Navbar from './components/Navbar';
import Main from './components/Main'

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

const App = () => {
  const [dstorage, setDstorage] = useState(null);
  const [account, setAccount] = useState(null);
  const [filesCount, setFilesCount] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedFileBuffer, setCapturedFileBuffer] = useState(null);
  const [capturedFileType, setCapturedFileType] = useState(null);
  const [capturedFileName, setCapturedFileName] = useState(null);
  
  useEffect(() => {
    const loadBlockchainData = async() => {
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
        const auxFilesCount = await dstorage.methods.fileCount().call()
        setFilesCount(auxFilesCount);
        // Load files&sort by the newest
        for (let i = filesCount; i >= 1; i--) {
          const file = await dstorage.methods.files(i).call()
          setFiles(prevState => {
            return [...prevState, file];
          });
        }
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
      console.log('buffer', capturedFileBuffer);
    }      
  };

  // Upload file to IPFS and push to the blockchain
  const uploadFile = description => {
    console.log("Submitting file to IPFS...");

    // Add file to the IPFS
    ipfs.add(capturedFileBuffer, (error, result) => {
      console.log('IPFS result', result.size);
      if(error) {
        console.error(error);
        return;
      }

      setIsLoading(true);
      // Assign value for the file without extension
      if(capturedFileType === ''){
        setCapturedFileType('none');
      }

      dstorage.methods.uploadFile(result[0].hash, result[0].size, capturedFileType, capturedFileName, description).send({ from: account })
      .on('transactionHash', (hash) => {
        setIsLoading(false);
        setCapturedFileType(null);
        setCapturedFileName(null);

        window.location.reload()
      })
      .on('error', (e) =>{
        window.alert('Error');
        setIsLoading(false);  
      })
    });
  };
  
  // return (
  //   <React.Fragment>
  //     <Navbar account={account} />
  //   </React.Fragment>
  // );

  return (
    <React.Fragment>
      <Navbar account={account} />
      {isLoading && <div id="loader" className="text-center mt-5"><p>Loading...</p></div>}
      {!isLoading && <Main files={files} captureFile={captureFile} uploadFile={uploadFile} />}
    </React.Fragment>
  );
};

export default App;