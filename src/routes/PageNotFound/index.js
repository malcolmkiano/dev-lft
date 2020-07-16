import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const PageNotFound = () => {
  return (
    <section className="wrapper fourohfour">
      <Helmet>
        <title>404 - Dev LFT</title>
      </Helmet>
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>Looks like you got a little lost. Let's start over.</p>
      <Link to="/">
        <Button isLink={true}>Go home</Button>
      </Link>
    </section>
  );
};

export default PageNotFound;
