import React from "react";
import { ChangeSelection } from "./components";

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

  render() {
    return <ChangeSelection />;
  }
}

export default App;
