import React from "react";
import { StyledButton } from "./styles.js";

import { Dropdown, Option } from "./components";

let state_names = [];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        // console.log(
        //   data.states.map((state) => {
        //     return state.state_name;
        //   })
        // );
        state_names = data.states.map((state) => {
          return state.state_name;
        });
        console.log(state_names);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(changeObject) {
    this.setState(changeObject);
    // console.log(changeObject);
  }

  render() {
    return (
      <div>
        <Dropdown
          formLabel="Choose a State"
          onChange={(e) => {
            console.log("State Chosen");
            this.handleChange({ selectedState: e.target.value });
          }}
        >
          <Option selected value="Click to see states" />
          <Option value="Option 1" />
          <Option value="Option 2" />
          <Option value="Option 3" />
        </Dropdown>
        <p>You selected {this.state.selected_district} </p>
        <Dropdown
          formLabel="Choose a District"
          onChange={(e) => {
            this.handleChange({ selected_district: e.target.value });
          }}
        >
          <Option selected value="Click to see options" />
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
