import Identicon from 'identicon.js';
import box from '../img/box.png'

const Navbar = (props) => {
  return (
    <nav className="navbar navbar-dark bg-dark p-0">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/#">
        <img src={box} width="30" height="30" className="align-top" alt="" />
        {' mTC-DStorage'}
      </a>
      <ul className="navbar-nav px-3">
        <li className="nav-item">
          <a 
            className="nav-link small" 
            href={`https://etherscan.io/address/${props.account}`}
            target="blank"
            rel="noopener noreferrer"
          >
            {props.account}
            {props.account
              ? <img
                  alt=""
                  className='ml-2'
                  width='30'
                  height='30'
                  src={`data:image/png;base64,${new Identicon(props.account, 30).toString()}`}
                />
              : <span></span>
          }
          </a>
        </li>
      </ul>
    </nav>
  );  
};

export default Navbar;