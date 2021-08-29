import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";
import { render } from "@testing-library/react";

let states = [];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "2px #002060",
    color: state.isSelected ? "white" : "black",
  }),
  control: (provided) => ({
    ...provided,
    margin: "2%",
  }),
};

function App() {
  const [state_list, setStateList] = React.useState([]);
  const [selected_state, setState] = React.useState("");
  const [selected_state_id, setStateId] = React.useState("");
  const [selected_district, setDistrict] = React.useState("");
  const [selected_district_id, setDistrictId] = React.useState("");
  const [district_list, setDistrictList] = React.useState([]);
  const [sessions_list, setSessionsList] = React.useState([]);
  const [selected_date, setDate] = useState(false);
  const [showComponent, setComponent] = React.useState(false);
  const [valid, setValidity] = React.useState(true);
  const [message, setMessage] = React.useState(
    "Please input valid details to check availability"
  );

  //Getting States
  React.useEffect(() => {
    console.log("Inside getStates");
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states", {
      method: "GET",
      // mode: "no-cors",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        states = data.states.map((state) => {
          return { state_name: state.state_name, state_id: state.state_id };
        });

        setStateList(
          data.states.map((state) => {
            return { label: state.state_name, value: state.state_id };
          })
        );
      })
      .catch((err) => {
        // TODO: Handle possible errors
        console.log(err);
      });
  }, []);

  //Getting State-Id
  React.useEffect(() => {
    console.log("Inside get StateId");
    if (selected_state) {
      console.log("Selected State: ", selected_state.label);
      const state = states.filter((obj) => {
        return obj.state_name === selected_state.label;
      });
      setStateId(state[0].state_id);
    }
  }, [selected_state]);

  //Getting Sessions Details
  React.useEffect(() => {
    if (selected_district_id && selected_date && valid) {
      console.log("Inside getSessions");
      let date_string = selected_date.toLocaleString("en-GB").split(",")[0];
      console.log(
        "Selected District: ",
        selected_district_id,
        " Selected date: ",
        date_string
      );
      let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${selected_district_id}&date=${date_string}`;
      fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setSessionsList(data.sessions);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selected_district_id, selected_date, valid]);

  //Getting Districts
  React.useEffect(() => {
    if (selected_state_id) {
      console.log("Inside getDistricts");
      let url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${selected_state_id}`;
      fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDistrictList(
            data.districts.map((district) => {
              return {
                label: district.district_name,
                value: district.district_id,
              };
            })
          );
          // console.log(this.state.district_list);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selected_state_id]);

  // If any input changes, table should be reset
  useEffect(() => {
    console.log("--Setting show component to false--");
    setComponent(false);
  }, [selected_date, selected_district_id, selected_state]);

  // Handle Change of State Names
  function handleChange(changeObject) {
    setState(changeObject);
    setMessage("Now, please select a valid district");
    console.log("Resetting district value");
    setDistrict("");
    setDistrictId("");
    setSessionsList([]);
    setValidity(false);
  }

  // Handling change of district names
  function handleChangeDistrict(changeObject) {
    setDistrict(changeObject.label);
    setDistrictId(changeObject.value);
    setValidity("true");
    setMessage(
      "Now choose a date and click Submit button to check availability!"
    );
  }

  // Handling clicking Submit button
  function buttonClick(e) {
    e.preventDefault();
    setComponent(true);
  }

  return (
    <div>
      {/* <div> */}
      <form className="session-form col-lg-4 col-md-6 col-sm-12 col-xs-12">
        <div>
          <Select
            className="dropdown-select"
            styles={customStyles}
            value={selected_state}
            placeholder="Choose a State"
            onChange={(selectedOption) => {
              // console.log("State Chosen ", selectedOption);
              handleChange(selectedOption);
            }}
            options={state_list}
            autoFocus={true}
            isSearchable
          />
        </div>
        <div>
          {/* <Select
            className="dropdown-select"
            styles={customStyles}
            placeholder="Choose a District"
            onChange={(selectedOption) => {
              console.log(selectedOption);
              handleChangeDistrict(selectedOption);
            }}
            value={selected_district}
            isSearchable
            options={district_list}
          /> */}
          <Select
            className="dropdown-select"
            styles={customStyles}
            // value={selected_district}
            placeholder="Choose a District"
            onChange={(selectedOption) => {
              // console.log("Selected District ", selectedOption);
              handleChangeDistrict(selectedOption);
            }}
            options={district_list}
            isSearchable
          />
        </div>

        <DatePicker
          selected={selected_date}
          placeholderText="Choose a date"
          wrapperClassName="datePicker"
          onChange={(date) => {
            setDate(date);
          }}
          dateFormat="dd/MM/yyyy"
        />
        <button className="submit-button" onClick={buttonClick.bind(this)}>
          {" "}
          Submit{" "}
        </button>
      </form>

      <section className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
        {console.log(sessions_list)}
        {
          showComponent && sessions_list.length && valid ? (
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
                {sessions_list.map((hospital) => {
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
          ) : showComponent && valid ? (
            "Sorry! No sessions available😢"
          ) : (
            <div className="message"> {message} </div>
          )
          // showComponent ? (
          //   "Sorry! No sessions available😢"
          // ) : (
          //   "Please input valid details to check availability"
          // )
        }
      </section>
    </div>
  );
}

export default App;
