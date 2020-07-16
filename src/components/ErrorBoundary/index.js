import React, { Component } from 'react';
import Button from '../Button';
import { Helmet } from 'react-helmet';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, redirect: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="wrapper fourohfour">
          <Helmet>
            <title>Dev LFT | Side Projects Conquered</title>
          </Helmet>

          <h1>Oops!</h1>
          <h2>An error occurred.</h2>
          <p>Sorry about that.</p>
          <Button onClick={this.refresh}>Click here to refresh</Button>
        </section>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
