export function mockContact(channelType, from) {
  const mock = {
    contactId: Date.now(),
    attributes: {
      name: 'Mockle Userton',
      email: 'mock@mockinc.biz',
      age: 99,
      phone: '+15552213456',
    },
  };
  switch (channelType) {
    case 'messaging':
      mock.attributes.name = from;
      break;
    case 'sms':
      mock.attributes.mobile = from;
      break;
    case 'email':
      mock.attributes.email = from;
      break;
    default:
  }
  return mock;
}
