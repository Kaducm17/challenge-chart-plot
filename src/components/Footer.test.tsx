import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Footer from '../components/Footer'

it('The footer will be rendered without any errors', () => {
  renderer.create(<Footer></Footer>);
});