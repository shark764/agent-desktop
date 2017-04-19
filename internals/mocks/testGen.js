/* eslint-disable */
// TODO: tidy up and roll into generators

const moduleName = process.argv[2];
const format = process.argv[3];
const fs = require('fs');

const dir = `../../app/components/${moduleName}/tests`;

if (!fs.existsSync(dir)) {
fs.makedirSync(dir);
}

if (format === 'looped') {
fs.writeFileSync(`${dir}/index.test.js`, `import React from 'react';
import { shallow } from 'enzyme';

import ${moduleName} from '../index';

const options = ['exampleOption'];

options.forEach((option) => {
  describe('<${moduleName} />', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <${moduleName}
          id="mockId"
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
`);
} else if (format === 'intl') {
fs.writeFileSync(`${dir}/index.test.js`, `import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import ${moduleName} from '../index';

describe('<${moduleName} />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <${moduleName}.WrappedComponent
        id="mockId"
        intl={getIntlContext()}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
`);
} else {
  fs.writeFileSync(`${dir}/index.test.js`,`import React from 'react';
import { shallow } from 'enzyme';

import ${moduleName} from '../index';

describe('<${moduleName} />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <${moduleName}
        id="mockId"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
`);
}
console.log(`test file written in ${dir}!`);