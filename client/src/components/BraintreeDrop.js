import React from 'react';
import {
  Dimmer,
  Loader,
  Segment,
} from 'semantic-ui-react';
import { setFlash } from '../actions/flash';
import { connect } from 'react-redux';
import { setHeaders } from '../actions/headers';
import braintree from 'braintree-web-drop-in';
import BraintreeDropin from 'braintree-dropin-react';
import BraintreeSubmitButton from './BraintreeSubmitButton';
import axios from 'axios';
import { Redirect } from 'react-router-dom'; // what does this do again?

class BraintreeDrop extends React.Component {
  state = { loaded: false, token: '', redirect: false, transactionId: '', }

  componentDidMount() {
    const { dispatch } = this.props;
    axios.get('/api/braintree_token')
      .then( ({ data: token, headers }) => {
        dispatch(setHeaders(headers))
        this.setState({ token, loaded: true })
      })
      .catch( ({ headers }) => {
        dispatch(setHeaders(headers))
        dispatch(setFlash('Bad Stuff!', 'red'))
      })
  }

  handlePaymentMethod = (payload) => {
    // debugger
    const { dispatch, amount } = this.props;
    // const { amount } = this.state;
    axios.post('/api/payment', { amount, ...payload } ) // the payload conatins the nonce and some other stuff like last for digits
      .then( ({ data: transactionId, headers }) => {
        dispatch(setHeaders(headers))
        this.setState({ transactionId, redirect: true })
      })
  }

  render() {
    const { loaded, token, redirect, transactionId } = this.state;

    if (redirect) // redirect allows you to pass data, unlink a link to or a history.
      return (
        <Redirect to={{ 
          pathname: '/payment_success',
          state: { amount: this.props.amount, transactionId } //this will go along witht he redirect, and then it will go to the r
        }}  />//you can pass a string to just go somewhere, or you can pass an object to go somewhere "pathname" and pass data with it.
      )


    if (loaded)
      return (
        <Segment basic textAlign="center">
          <BraintreeDropin
            braintree={braintree}
            authorizationToken={token}
            handlePaymentMethod={this.handlePaymentMethod}
            renderSubmitButton={BraintreeSubmitButton}
          />
        </Segment>
      )
    else
      return (
        <Dimmer active>
          <Loader>
            Loading payment experience...
          </Loader>
        </Dimmer>
      )
  }
}

export default connect()(BraintreeDrop);