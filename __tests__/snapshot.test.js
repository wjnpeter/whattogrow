
import React from 'react';
import renderer from 'react-test-renderer';

import Home from '../pages/index'

import Forecast from '../components/search/Forecast'
import Moon from '../components/search/Moon'
import LocZone from '../components/search/loc/LocZone'
import Historical from '../components/search/loc/Historical'
import Agriculture from '../components/search/loc/Agriculture'
import Soil from '../components/search/loc/Soil'

test('Home page', () => {
  const component = renderer.create(<Home />)
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})

test('Forecast Popover', () => {
  const component = renderer.create(<Forecast />)
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})

test('Moon Popover', () => {
  const component = renderer.create(<Moon />)
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})

test('Location - LocZone', () => {
  const component = renderer.create(<LocZone />)
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})

test('Location - Historical', () => {
  const component = renderer.create(<Historical />)
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})

test('Location - Agriculture', () => {
  const component = renderer.create(<Agriculture />)
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})

test('Location - Soil', () => {
  const component = renderer.create(<Soil />)
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
