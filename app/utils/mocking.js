export default function mockContact(channelType, liveInput) {
  const mock = {
    contactId: Date.now(),
    attributes: {
      name: 'Mockle Userton',
      title: 'Head Baker',
      marketSegment: 'Bread',
      email: 'mock@mockinc.biz',
      age: 99,
      mobile: '15552213456',
      address1: 'Apartment 23',
      address2: '39 Rue de Faux',
      city: 'Sheffield',
      state: 'MA',
      zipCode: '35660',
    },
  };
  switch (channelType) {
    case 'messaging':
    case 'name':
      mock.attributes.name = liveInput;
      break;
    case 'sms':
    case 'voice':
    case 'phone':
      mock.attributes.mobile = liveInput;
      break;
    case 'email':
      mock.attributes.email = liveInput;
      break;
    case 'address':
      mock.attributes.address1 = liveInput;
      break;
    default:
  }
  return mock;
}
