
import React, { Component } from 'react';

class Routes extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {buses: this.props.buses};
  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //  return nextProps.buses !== this.props.buses;
  // } 
  // componentWillReceiveProps(nextProps) {
  //   this.setState({buses: nextProps.buses});
  // }
  render() {  
    return (
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Buse Amount</th>
          </tr> 
          <tr>
            <td>DASDASD</td>
            <td>20</td>
          </tr> 
        </thead>  
      </table>
    );  
  }
}

export default Routes;
