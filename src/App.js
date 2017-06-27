import React, { Component } from 'react';
import logo from './logo.png';
import se from '../public/bus_icons/south_east.png';
import sw from '../public/bus_icons/south_west.png';
import ne from '../public/bus_icons/north_east.png';
import nw from '../public/bus_icons/north_west.png';
import ee from '../public/bus_icons/east.png';
import ss from '../public/bus_icons/south.png';
import ww from '../public/bus_icons/west.png';
import nn from '../public/bus_icons/north.png';
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
        console.log(msg);
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
            const image = function (bearing){
              if(bearing == 0){
                return nn;
              }else if(bearing > 0 && bearing <90 ){
                return ne;
              }else if(bearing == 90){
                return ee;
              }else if(bearing > 90 && bearing < 180){
                return ne;
              }else if(bearing == 180){
                return ss;
              }else if(bearing > 180 && bearing < 270){
                return sw;
              }else if(bearing == 270){
                return ww;
              }else if(bearing > 270 && bearing < 360){
                return nw;
              }
            }(position.bearing)

            if(bus){
              bus.position = {lat: position.latitude, lng: position.longitude};
              this.setState({buses: this.state.buses}); 
            }else{
              this.setState({buses:[...this.state.buses, {
                                    icon: image,
                                    title: routeName,
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
          <h2>Bus Transportation Map</h2>
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
