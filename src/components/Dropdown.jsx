import { useState } from "react";
import PropTypes from "prop-types";
import compStyles from "./components.module.css";

const Dropdown = ({ options, selectedIdx, setSelectedIdx }) => {
  const [openDropDown, setOpenDropDown] = useState(false);

  const handleSetSort = (idx) => {
    setSelectedIdx(idx);
    setOpenDropDown(false);
  };

  return (
    <div className={compStyles.dropDown}>
      <div className={compStyles.buttons}>
        <p>{options[selectedIdx]}</p>

        <button
          onClick={() => setOpenDropDown(!openDropDown)}
        >
          <img
            src={"./icons/filter.svg"}
          />
        </button> 
      </div> 
      <ul className={`${compStyles.dropDownList} ${!openDropDown ? compStyles.close : ""}`}>
        {options.map((option, idx) => (
          <li key={option}><button onClick={() => handleSetSort(idx)}>{option}</button></li>
        ))}
      </ul>
    </div>
  )
};

export default Dropdown;

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedIdx: PropTypes.number.isRequired,
  setSelectedIdx: PropTypes.func.isRequired,
}