import React, { useState } from "react";
import "./styles.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let states = [];
let selected_date = new Date().toLocaleDateString("en-GB").split(",")[0];

const SelectDate = () => {
  const [startDate, setDate] = useState(new Date());
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        selected_date = date.toLocaleString("en-GB").split(",")[0];
        // console.log(selected_date);
        setDate(date);
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
          {/* TODO: If no info show a message saying so */}
          {this.props.info &&
            this.props.info.map((hospital) => {
              return (
                <tr key={hospital.session_id}>
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
    // console.log("Inside getStates");
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getHospitals(district_id) {
    // console.log("Inside getDistricts");
    let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${selected_date}`;
    fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          sessions_list: data.sessions,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getDistricts(state_id) {
    // console.log("Inside getDistricts");
    let url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`;
    fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          district_list: data.districts.map((district) => {
            return {
              label: district.district_name,
              value: district.district_id,
            };
          }),
        });
        // console.log(this.state.district_list);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(changeObject) {
    this.setState(changeObject, () => {
      // console.log(this.state.selected_state.label);
      const state = states.filter((obj) => {
        return obj.state_name === this.state.selected_state.label;
      });
      this.getDistricts(state[0].state_id);
    });
  }

  buttonClick(e) {
    e.preventDefault();
    this.setState({
      showComponent: true,
    });
    this.getHospitals(
      this.state.selected_district
      // , () => {
      // console.log(e);
      // console.log(this.state);
      // }
    );
  }

  render() {
    return (
      <div>
        <form>
          <label>Choose a State</label>
          <Select
            placeholder={this.state.selected_state.label}
            onChange={(selectedOption) => {
              // console.log("State Chosen ", selectedOption);
              this.handleChange({ selected_state: selectedOption });
            }}
            options={this.state.state_list}
          />
          <label>Choose a District</label>
          <Select
            placeholder={this.state.selected_district.label}
            onChange={(selectedOption) => {
              // console.log(selectedOption);
              this.setState({ selected_district: selectedOption.value }, () => {
                console.log(`District selected:`, this.state.selected_district);
              });
            }}
            options={this.state.district_list}
          />
          <label>Choose a Date</label>
          <SelectDate />
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
