
import React, { Component } from 'react';
import _ from 'lodash';

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {routes: this.props.routes};
  }
  shouldComponentUpdate(nextProps, nextState) {

   return nextProps.routes !== this.props.routes;
  } 
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.routes);
    this.setState({routes: nextProps.routes});  
  }
  render() {
    const list = this.state.routes.map( (route, i) => {
      return (
        <tr key={i}>
          <td style={{textAlign:'left'}}>{route.routeName}</td>
          <td>{route.amount}</td>
        </tr>
      );
    });
    
    return (
      <table style={{float: 'right'}}>
         <tbody>
          <tr>
            <th>Routes</th>
            <th>Amount</th>
          </tr>
          {list}
         </tbody>
      </table>
        
    );  
  }
}

export default Routes;
