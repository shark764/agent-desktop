/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import StatValue from '../StatValue';

let mockStat;
let rendered;

console.warn = jest.fn();

const possibleAggregates = [
  'count',
  'percent',
  'avg',
  'max',
  'min',
  'total',
];

const aggregatesToTest = [...possibleAggregates, 'mockImpossibleAggregate'];

const shouldRenderCorrectlyTest = (message) => {
  it(message || 'should render correctly', () => {
    expect(rendered).toMatchSnapshot();
  });
};

describe('<StatValue />', () => {
  aggregatesToTest.forEach((aggregate) => {
    describe(`if stat.statAggregate is ${aggregate}`, () => {
      beforeEach(() => {
        mockStat = {
          results: {},
        };
        mockStat.statAggregate = aggregate;
        mockStat.results[aggregate] = 1;
        mockStat.isErrored = false;
      });
      describe('and isErrored is false', () => {
        beforeEach(() => {
          console.warn.mockClear();
          rendered = shallow(
            <StatValue
              stat={mockStat}
            />
          );
        });
        shouldRenderCorrectlyTest();
        if (possibleAggregates.includes(aggregate)) {
          it('should not console.warn', () => {
            expect(console.warn.mock.calls[0]).toBeUndefined();
          });
        } else {
          it('should console.warn', () => {
            expect(console.warn.mock.calls[0]).toMatchSnapshot();
          });
        }
      });
      describe('and isErrored is true', () => {
        beforeEach(() => {
          console.warn.mockClear();
          mockStat.isErrored = true;
          rendered = shallow(
            <StatValue
              stat={mockStat}
            />
          );
        });
        shouldRenderCorrectlyTest('should render with "-" instead of value');
      });
    });
  });
});
