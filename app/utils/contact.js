export const formatValue = (attributeToValidate, value) => {
  let formattedValue;
  switch (attributeToValidate.type) {
    case 'phone':
      formattedValue = value.replace(/[^0-9+*#]/g, '');
      if (formattedValue.indexOf('+') !== 0 && formattedValue.length > 0) {
        formattedValue = `+${formattedValue}`;
      }
      break;
    case 'boolean':
      if (value === 'false' || value === '') formattedValue = false;
      else formattedValue = !!value;
      break;
    default:
      formattedValue = value;
  }
  return formattedValue;
};
