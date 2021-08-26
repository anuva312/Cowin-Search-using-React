import React from "react";
import { StyledButton } from "./styles.js";
import "./styles.css";
import Select from "react-select";

let states = [];
let districts = [];

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

  getDistricts(state_id) {
    console.log("Inside getDistricts");
    let url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`;
    console.log(url);
    fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        districts = data[0];
        console.log(districts);
        this.setState({
          district_list: data.districts.map((state) => {
            return {
              label: state.district_name,
              value: state.district_id,
            };
          }),
        });
        console.log(this.state.district_list);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(changeObject) {
    console.log(changeObject);
    this.setState(changeObject, () => {
      const state = states.filter((obj) => {
        return obj.state_name === this.state.selected_state;
      });
      console.log(state[0].state_id);
      this.getDistricts(state[0].state_id);
    });
  }

  render() {
    return (
      <div>
        {/* FIXME: Control not even going inside onChange*/}
        <label>Choose a State</label>
        <select
          onChange={(e) => {
            console.log("State Chosen ", e.target.value);
            this.handleChange({ selected_state: e.target.value });
            // this.setState({ selected_state: e.target.value });
            // console.log(this.state.selected_state);
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

        <label>Choose a District</label>

        <Select
          value="Choose a district"
          onChange={(selectedOption) => {
            this.setState({ selectedOption });
            console.log(`District selected:`, selectedOption);
          }}
          options={this.state.district_list}
        />

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
