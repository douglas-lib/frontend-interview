
import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {buses: this.props.buses};
  }
  shouldComponentUpdate(nextProps, nextState) {
   return nextProps.buses !== this.props.buses;
  } 
  componentWillReceiveProps(nextProps) {
    this.setState({buses: nextProps.buses});
  }
  render() {  
    return (
      <GoogleMap
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}>
        {this.state.buses.map((marker, index) => (

          <Marker key={index} {...marker} />
          )
        )}
      </GoogleMap>
    );  
  }
}

export default withGoogleMap(Map);
