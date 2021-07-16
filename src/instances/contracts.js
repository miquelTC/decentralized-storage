import web3 from './connection';
import DStorage from '../abis/DStorage.json';

//DStorage contract
const getDStorage = (networkId) => {
  try {
    return new web3.eth.Contract(DStorage.abi, DStorage.networks[networkId].address);
  } catch(error) {
    return;
  }
};

export default getDStorage;