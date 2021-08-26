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

class Sessions extends React.Component {
  render() {
    console.log(this.props.info);
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Hospital Name</th>
            <th>Address</th>
            <th>Available Capacity Dose 1</th>
            <th>Available Capacity Dose 2</th>
            <th>Vaccine Name</th>
          </tr>
        </thead>
        <tbody>
          {this.props.info &&
            this.props.info.map((hospital) => {
              return (
                <tr key={hospital.name}>
                  <td>{hospital.name}</td>
                  <td>{hospital.address}</td>
                  <td>{hospital.available_capacity_dose1}</td>
                  <td>{hospital.available_capacity_dose2}</td>
                  <td>{hospital.vaccine}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state_list: [],
      selected_state: "",
      selected_district: "",
      district_list: [],
      sessions_list: [],
      showComponent: false,
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
        console.log(data.sessions);
        this.setState({
          sessions_list: data.sessions,
        });
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

  buttonClick(e) {
    e.preventDefault();
    this.setState({
      showComponent: true,
    });
    this.getHospitals(this.state.selected_district, () => {
      console.log(e);
      console.log(this.state);
    });
  }

  render() {
    return (
      <div>
        <form>
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
          {/* <StyledButton
          type="submit"
          value="Submit"
          onClick={() => {
            this.getHospitals(this.state.selected_district);
          }
        /> */}
          <button onClick={this.buttonClick.bind(this)}> Submit </button>
        </form>

        {this.state.showComponent && this.state.sessions_list && (
          <Sessions info={this.state.sessions_list}></Sessions>
        )}
        {/* <Sessions info={this.state.sessions}></Sessions>; */}
      </div>
    );
  }
}

export default App;
