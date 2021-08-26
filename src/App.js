import React, { useState } from "react";
import { StyledButton } from "./styles.js";
import "./styles.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let states = [];
let districts = [];
let selected_date = new Date().toLocaleDateString("en-GB").split(",")[0];
console.log(selected_date);

const SelectDate = () => {
  const [startDate, setDate] = useState(new Date());
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        selected_date = date.toLocaleString("en-GB").split(",")[0];
        console.log(selected_date);
        setDate(date);
        console.log();
      }}
      dateFormat="dd/MM/yyyy"
    />
  );
};

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
        this.setState({
          state_list: data.states.map((state) => {
            return { label: state.state_name, value: state.state_id };
          }),
        });
        console.log(this.state.state_list);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getHospitals(district_id) {
    console.log("Inside getDistricts");
    let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${selected_date}`;
    console.log(url);
    fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // districts = data[0];
        console.log(data);
        // this.setState({
        //   district_list: data.districts.map((state) => {
        //     return {
        //       label: state.district_name,
        //       value: state.district_id,
        //     };
        //   }),
        // });
        // console.log(this.state.district_list);
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
    this.setState(changeObject, () => {
      console.log(this.state.selected_state.label);
      const state = states.filter((obj) => {
        return obj.state_name === this.state.selected_state.label;
      });
      console.log(state[0].state_id);
      this.getDistricts(state[0].state_id);
    });
  }

  render() {
    return (
      <div>
        <label>Choose a State</label>

        <Select
          placeholder={this.state.selected_state.label}
          onChange={(selectedOption) => {
            console.log("State Chosen ", selectedOption);
            this.handleChange({ selected_state: selectedOption });
          }}
          options={this.state.state_list}
        />

        <label>Choose a District</label>

        <Select
          placeholder={this.state.selected_district.label}
          onChange={(selectedOption) => {
            console.log(selectedOption);
            this.setState({ selected_district: selectedOption.value }, () => {
              console.log(`District selected:`, this.state.selected_district);
            });
          }}
          options={this.state.district_list}
        />

        <label>Choose a Date</label>

        <SelectDate />

        <StyledButton
          type="submit"
          value="Submit"
          onClick={() => {
            this.getHospitals(this.state.selected_district);
          }}
        />
      </div>
    );
  }
}

export default App;
