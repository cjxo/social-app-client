import { Link } from "react-router-dom";
import { useState } from "react";
import compStyles from "./components.module.css";
import PropTypes from "prop-types";

// types: 
// - button0
const Button = ({ type="button0", className, children, onClick, submit=true }) => {
  return (
  	<button
  	  className={`${compStyles[type] || ""} ${className}`}
  	  onClick={onClick}
  	  type={submit ? "submit" : "button"}
  	>
  	  {children}
  	</button>
  );
};

const LinkButton = ({ type="button0", className, children, to }) => {
  return (
  	<Link
  	  className={`${compStyles[type] || ""} ${className}`}
  	  to={to}
  	>
  	  {children}
  	</Link>
  );
};

const TextArea = ({ children, ...rest }) => {
  return (
    <textarea
      {...rest}
      className={compStyles.textInput0}
    >{children}</textarea>
  );
};

const TextInput = ({ ...rest }) => {
  return (
    <input {...rest} className={compStyles.textInput0} />
  );
};

const SearchBar = ({ placeholder, searchValue, setSearchValue }) => {
  return (
    <div className={compStyles.searchBar}>
      <img
        src="./icons/search.svg"
        width={24}
        height={24}
        alt="search"
      />
      
      <input
        type="text"
        placeholder={placeholder}
        className={compStyles.searchInput}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

export { Button, TextArea, TextInput, SearchBar, LinkButton };

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  submit: PropTypes.bool,
};

LinkButton.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
};

SearchBar.propTypes = {
  placeholder: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
};