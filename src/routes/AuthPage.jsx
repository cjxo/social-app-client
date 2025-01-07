import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import routeStyles from './route.module.css';
import { useAuth } from "../context/AuthContext";

const AuthPage = ({ children }) => {
  const auth = useAuth();
  if (auth.isLoading) {
    return <>Loading...</>;
  }
  return (
    <>
      {auth.isAuth ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className={routeStyles.authPage}>
            {children}
          </section>
        </>
      ) 
    }
    </>
  );
};

AuthPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthPage;
