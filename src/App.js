import React from "react";
import { StyledButton } from "./styles.js";
import { Dropdown, Option } from "./components";

let states = [];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state_list: [],
      selected_state: "",
      district_list: [],
      selected_district: "",
      hospital_name: "",
      address: "",
      availability: "",
      dose1: "",
      dose2: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log("Inside getStates");
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        states = data.states.map((state) => {
          return { state_name: state.state_name, state_id: state.state_id };
        });
        this.setState({ state_list: states });
        console.log(this.state.state_list);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(changeObject) {
    console.log(changeObject);
    this.setState(changeObject);
  }

  render() {
    return (
      <div>
        {/* FIXME: Control not even going inside onChange*/}
        <select
          formlabel="Choose a State"
          onChange={(e) => {
            console.log("State Chosen");
            this.handleChange({ selected_state: e.target.value });
          }}
        >
          {this.state.state_list.map((obj) => {
            return (
              <option key={obj.state_id} value={obj.state_name}>
                {obj.state_name}
              </option>
            );
          })}
        </select>

        {/* FIXME: Control not even going inside onChange*/}
        <Dropdown
          formLabel="Choose a District"
          onChange={(e) => {
            this.handleChange({ selected_district: e.target.value });
          }}
        >
          <Option selected value="Click to see districts" />
          <Option value="Option 1" />
          <Option value="Option 2" />
          <Option value="Option 3" />
        </Dropdown>
        <p>You selected {this.state.selected_district} </p>
        <StyledButton
          type="submit"
          value="Submit"
          onClick={this.handleSelect}
        />
      </div>
    );
  }
}

export default App;
