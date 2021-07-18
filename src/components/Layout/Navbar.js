import logo from '../../img/logo.png'

const Navbar = (props) => {
  return (
    <nav className="navbar navbar-dark bg-primary p-0">
      <a className="navbar-brand" href="/#">
        <img src={logo} width="40" height="40" className="align-center" alt="logo" />
        mTC DStorage
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
          </a>
        </li>
      </ul>
    </nav>
  );  
};

export default Navbar;