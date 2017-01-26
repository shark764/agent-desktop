export default function mockContact(channelType, liveInput) {
  const mockIndex = Math.floor(Math.random() * 5);
  const positionPairs = [
    {
      name: 'Mark Mockswith',
      title: 'Director of Phones',
      marketSegment: 'Business',
    },
    {
      name: 'Mockle Userton',
      title: 'Head Baker',
      marketSegment: 'Bread',
    },
    {
      name: 'Hams False',
      title: 'Associate Baker',
      marketSegment: 'Cake',
    },
    {
      name: 'Mockswine Lard',
      title: 'VP of Pens',
      marketSegment: 'Ink',
    },
    {
      name: 'Haute Falsify',
      title: 'Sound Inspector',
      marketSegment: 'Air Transportation',
    },
  ];
  const mock = {
    contactId: Date.now(),
    attributes: {
      name: positionPairs[mockIndex].name,
      title: positionPairs[mockIndex].title,
      marketSegment: positionPairs[mockIndex].marketSegment,
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
