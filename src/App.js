import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import logo from './logo.png';
import './App.css';
import RTM from 'satori-sdk-js';
import _ from 'lodash';
import Map from './components/Map';
import Routes from './components/Routes';
// import ChannelService from './services/ChannelService'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      buses: [],
      routes: []
    };
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
            const busId = msg.entity[0].id,
                  routeId = msg.entity[0].vehicle.trip.route_id,
                  routeName = msg.entity[0].vehicle.vehicle.label,
                  position = msg.entity[0].vehicle.position;
            const route = _.find(this.state.routes, {routeId: routeId});
            if(route){
                const busInRoute = _.find(route.buses, {busId: busId});
                if(!busInRoute){
                  route.amount++;
                  route.buses.push({busId: busId});
                  this.setState({routes: this.state.routes});
                }
            }else{
              this.setState({routes:[...this.state.routes, {
                                    routeId: routeId,
                                    routeName: routeName,
                                    buses: [{busId: busId}],
                                    amount: 1}
                                  ]
                          });           
            }  
            const bus = _.find(this.state.buses, {busId: busId});
            if(bus){
              bus.position = {lat: position.latitude, lng: position.longitude};
              this.setState({buses: this.state.buses}); 
            }else{
              this.setState({buses:[...this.state.buses, {
                                    busId: busId, 
                                    routeId: routeId,
                                    position:{
                                      lat:position.latitude,
                                      lng:position.longitude}
                                    }
                                  ]
                          });           
            }     
            
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
        <Routes className="App-routes" routes={this.state.routes}/>
        <div style={{width: `70%`, height: 800}}>
                <Map
                  buses={this.state.buses}
                  center={{ lat: 45.542094, lng: -122.9346037 }}
                  zoom={10} 
                  containerElement={<div style={{ height: `100%` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                />
              </div>
      </div>
      
    );
  }
}

export default App;
