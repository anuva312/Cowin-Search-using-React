import {
  DropdownWrapper,
  StyledSelect,
  StyledOption,
  StyledLabel,
} from "./styles.js";

export function Dropdown(props) {
  return (
    <DropdownWrapper action={props.action}>
      <StyledLabel htmlFor="options">{props.formLabel}</StyledLabel>
      <StyledSelect id="options" name="options">
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

// export function DropDownOptions(props) {
//   const dropDownList = props.options.map((item, id) => {
//     return <option key={id} value={item}></option>;
//   });
//   console.log(dropDownList);
//   return dropDownList;
// }
