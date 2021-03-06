import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

// Custom-Styles for Select Component
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

// Component to show Intro-Message
function InfoMessage() {
  return (
    <div className="message" id="info-message">
      <h2>Are You Protected Against Covid?</h2>
      <h3>Check Your Nearest Vaccination Center And Slots Availability</h3>
      Please give details to Search By District!
    </div>
  );
}

function App() {
  const [state_list, setStateList] = React.useState([]);
  const [selected_state_id, setStateId] = React.useState("");
  const [selected_district_id, setDistrictId] = React.useState("");
  const [district_list, setDistrictList] = React.useState([]);
  const [sessions_list, setSessionsList] = React.useState([]);
  const [selected_date, setDate] = useState(undefined);
  const [showComponent, setComponent] = React.useState(false);
  const [valid, setValidity] = React.useState(false);
  const [message, setMessage] = React.useState("Please select valid details!");

  // Error handler for unable to fetch data
  function handleError(err) {
    console.log(err);
    setMessage(<p className="error">Sorry😢 Something went wrong 💥</p>);
  }

  // Function for fetching data using API
  function fetchData(url) {
    return fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }).then((response) => response.json());
  }

  //Component to show available Session's details in a table
  function ShowTable() {
    return (
      <div>
        <table className="table table-striped ">
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
      </div>
    );
  }

  //Getting States
  React.useEffect(() => {
    const url = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
    fetchData(url)
      .then((data) => {
        setStateList(
          data.states.map((state) => {
            return { label: state.state_name, value: state.state_id };
          })
        );
      })
      .catch((err) => {
        handleError(err);
      });
  }, []);

  //Getting Districts
  React.useEffect(() => {
    if (selected_state_id) {
      let url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${selected_state_id}`;
      fetchData(url)
        .then((data) => {
          setDistrictList(
            data.districts.map((district) => {
              return {
                label: district.district_name,
                value: district.district_id,
              };
            })
          );
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }, [selected_state_id]);

  //Getting Available Sessions and their details
  React.useEffect(() => {
    if (selected_district_id && selected_date && valid) {
      let date_string = selected_date.toLocaleString("en-GB").split(",")[0];
      console.log(
        "Selected District: ",
        selected_district_id,
        " Selected date: ",
        date_string
      );
      let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${selected_district_id}&date=${date_string}`;
      fetchData(url)
        .then((data) => {
          setSessionsList(data.sessions);
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }, [selected_district_id, selected_date, valid]);

  // If any of the inputs change, table should be reset
  useEffect(() => {
    setComponent(false);
  }, [selected_state_id, selected_date, selected_district_id]);

  // Handling change of State names
  function handleChangeState(changeObject) {
    setStateId(changeObject.value);
    setMessage("Please select a valid district!");
    setDistrictId("");
    setSessionsList([]);
    setValidity(false);
  }

  // Handling change of District names
  function handleChangeDistrict(changeObject) {
    setDistrictId(changeObject.value);
    setValidity(true);
    setMessage(
      "Please choose a date and click Submit button to check availability!"
    );
  }

  // Handling clicking of Submit button
  function buttonClick(e) {
    e.preventDefault();
    setComponent(true);
  }

  //To render
  return (
    <div>
      <section className="col-lg-6 col-md-12">
        <form>
          {/* Select State */}
          <div>
            <Select
              className="dropdown-select"
              styles={customStyles}
              placeholder="Choose a State"
              onChange={(selectedOption) => {
                console.log("State Chosen ", selectedOption.label);
                handleChangeState(selectedOption);
              }}
              options={state_list}
              autoFocus={true}
              isSearchable
            />
          </div>

          {/* Select District */}
          <div>
            <Select
              className="dropdown-select"
              styles={customStyles}
              required="true"
              placeholder="Choose a District"
              onChange={(selectedOption) => {
                // console.log("District chosen: ", selectedOption.label);
                handleChangeDistrict(selectedOption);
              }}
              options={district_list}
              isSearchable
            />
          </div>

          {/* Select Date */}
          <div>
            <DatePicker
              selected={selected_date}
              placeholderText="Choose a date"
              wrapperClassName="datePicker"
              onChange={(date) => {
                setDate(date);
              }}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button className="submit-button" onClick={buttonClick.bind(this)}>
              {" "}
              Submit{" "}
            </button>
          </div>
        </form>
        {showComponent && (!valid || !selected_date) ? (
          <div className="message"> {message} </div>
        ) : null}
      </section>

      {/* Table show available vaccination sessions */}
      <section className="col-lg-6 col-md-12">
        {showComponent && sessions_list.length && valid && selected_date ? (
          <ShowTable></ShowTable>
        ) : showComponent && valid && selected_date ? (
          <div className="message">"Sorry! No sessions available😢"</div>
        ) : (
          <InfoMessage></InfoMessage>
        )}
      </section>
    </div>
  );
}

export default App;
