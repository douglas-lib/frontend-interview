import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Map from './components/Map'
import RTM from 'satori-sdk-js'
// import ChannelService from './services/ChannelService'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {buses: []};
  }

  componentDidMount(){

    
    const endpoint = "wss://open-data.api.satori.com";
    const appKey = "cd5cCD4cFeFA5106CacD9C59420fe2FB";

    const rtm = new RTM(endpoint, appKey);
    
    const myfilter = "SELECT * FROM transportation WHERE header.`user-data`='trimet'";
    const subscription = rtm.subscribe('myfilter', RTM.SubscriptionMode.SIMPLE, {
      filter: myfilter});

    subscription.on('rtm/subscription/data', (pdu) => {
      
      pdu.body.messages.forEach((msg) => {
        
        if(msg.entity[0].vehicle.trip){
            const buskey = msg.entity[0].id,
                  routekey = msg.entity[0].vehicle.trip.route_id,
                  route = msg.entity[0].vehicle.vehicle.label,
                  position = msg.entity[0].vehicle.position;
                 
            this.setState({buses:[...this.state.buses, {position:{lat:position.latitude,lng:position.longitude}}]});
          }
        
      });
    });
    rtm.start();
  }
  render() {
    
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Frontend Coding Exercise</h2>
        </div>
        <div style={{width: `100%`, height: 800, background: 'gray'}}>
          <Map
            buses={this.state.buses}
            center={{ lat: 45.510433, lng: -122.72343 }}
            zoom={8} 
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
      
    );
  }
}

export default App;
