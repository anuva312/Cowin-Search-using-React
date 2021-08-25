import React from "react";
import { ChangeSelection } from "./components";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state_names: [],
      districts: [],
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
        console.log(
          data.states.map((state) => {
            return state.state_name;
          })
        );
        // console.log(typeof [data]);
        // console.log(data.states);
        this.setState({
          state_names: data.states.map((state) => {
            return state.state_name;
          }),
        });
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
