import { Link } from 'react-router-dom';
import logoDark from 'assets/img/logo-dark.png';
import logoLight from 'assets/img/logo-light.png';

const LogoDark = () => {
  return (
    <Link to='/'>
      <img
        src={logoDark}
        alt='AIMass'
        width='96'
        height='24'
      />
    </Link>
  );
};

export default LogoDark;
