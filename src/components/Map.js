
import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buses: this.props.buses,
      choosen: this.props.choosenRoute
    };
    // this.onMarkerClick = this.onMarkerClick.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
   return nextProps.buses !== this.props.buses;
  } 
  componentWillReceiveProps(nextProps) {
    this.setState({buses: nextProps.buses});
  }
  onMarkerClick(marker){
    this.props.handleRouteChoose();
    this.setState({choosen: marker.routeId});
  }


  render() {  
    return (
      <GoogleMap
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}>
        {this.state.buses.map((marker, index) => {
            if(this.state.choosen){
              if(marker.routeId === this.state.choosen){
                return (<Marker key={index} 
                                {...marker} 
                                onClick={this.onMarkerClick.bind(this,marker)}
                        />);
              } 
            }else{
              return (<Marker key={index} 
                              {...marker} 
                              onClick={this.onMarkerClick.bind(this,marker)}
                      />);
            }
          
          }
        )}
      </GoogleMap>
    );  
  }
}

export default withGoogleMap(Map);
