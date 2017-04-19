import { IntlProvider } from 'react-intl';
import enUS from 'translations/en-US.json';

export const getIntlContext = () => {
  // Construct a new `IntlProvider` instance by passing `props` and
  // `context` as React would, then call `getChildContext()` to get the
  // React Intl API, complete with the `format*()` functions.
  const intlProvider = new IntlProvider({ locale: 'en-US', messages: enUS }, {});
  const { intl } = intlProvider.getChildContext();
  return intl;
};

export default { getIntlContext };
