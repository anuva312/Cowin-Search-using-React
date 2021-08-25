import React, { useState } from "react";
import {
  StyledButton,
  DropdownWrapper,
  StyledSelect,
  StyledOption,
  StyledLabel,
} from "./styles.js";

export function Dropdown(props) {
  return (
    <DropdownWrapper action={props.action}>
      <StyledLabel htmlFor="services">{props.formLabel}</StyledLabel>
      <StyledSelect id="services" name="services">
        {props.children}
      </StyledSelect>
    </DropdownWrapper>
  );
}

export function Option(props) {
  return (
    <StyledOption defaultValue={props.defaultValue}>{props.value}</StyledOption>
  );
}

export function ChangeSelection() {
  const [optionValue, setOptionValue] = useState("hello");
  const handleSelect = (e) => {
    console.log(e.target.value);
    setOptionValue(e.target.value);
  };
  return (
    <div>
      <Dropdown
        formLabel="Choose a State"
        buttonText="Select State"
        onChange={handleSelect}
      >
        <Option selected value="Click to see states" />
        <Option value="Option 1" />
        <Option value="Option 2" />
        <Option value="Option 3" />
      </Dropdown>
      <p>You selected {optionValue} </p>
      <Dropdown formLabel="Choose a District" onChange={handleSelect}>
        <Option selected value="Click to see options" />
        <Option value="Option 1" />
        <Option value="Option 2" />
        <Option value="Option 3" />
      </Dropdown>
      <p>You selected {optionValue} </p>
      <StyledButton type="submit" value="Submit" onClick={handleSelect} />
    </div>
  );
}

// class State extends React.Component {
//   render() {
//     return (
//       <Dropdown formLabel="Choose a State" action="/">
//         <Option defaultValue value="Click to see options" />
//         <Option value="Option 1" />
//         <Option value="Option 2" />
//         <Option value="Option 3" />
//       </Dropdown>
//     );
//   }
// }

// class District extends React.Component {
//   render() {
//     return (
//       <Dropdown formLabel="Choose a District">
//         <Option selected value="Click to see options" />
//         <Option value="Option 1" />
//         <Option value="Option 2" />
//         <Option value="Option 3" />
//       </Dropdown>
//     );
//   }
// }

// class Search extends React.Component {
//   const [optionValue, setOptionValue] = useState("");
//   const handleSelect = (e) => {
//     console.log(e.target.value);
//     setOptionValue(e.target.value);
//   render() {
//     return (
//       <div className="search-form">
//         <span className="search-input">
//           <State />
//         </span>
//         <span className="search-input">
//           <District />
//         </span>
//         {/* <StyledButton type="submit" value="Submit" onClick={<App />} /> */}
//         <App />
//       </div>
//     );
//   }
// }

// ========================================

// ReactDOM.render(<Search />, document.getElementById("root"));
