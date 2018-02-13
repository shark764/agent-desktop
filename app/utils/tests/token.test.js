/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import expireToken  from '../token';

describe('token', () => {
  let token;

  it('returns true if the current time is less than 9 hours past the expiration time of Monday, Feb 12, 13:23', () => {
    token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyLWlkIjoiOTk2YjVkODAtYTUxNy0xMWU2LThlOWItY2E4MTQ4NDQ4OGRmIiwidGVuYW50LWlkIjpudWxsLCJ0eXBlIjoidG9rZW4iLCJleHAiOjE1MTg0NjM0MDIsImlhdCI6MTUxODQ2MzM5Mn0.qzt9NgYsfQXacT9lt_rnm05yvjjY8fs6PAt_9Fq3o8g'; // Monday, Feb 12, 13:23

    expect(expireToken(token, 9, false)).toEqual(true)
  });

  it('returns false if the current time more than 9 hours before the expiration time of Feb 10, 2028, 13:33', () => {
    token =  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyLWlkIjoiOTk2YjVkODAtYTUxNy0xMWU2LThlOWItY2E4MTQ4NDQ4OGRmIiwidGVuYW50LWlkIjpudWxsLCJ0eXBlIjoidG9rZW4iLCJleHAiOjE4MzM4MjQxNjUsImlhdCI6MTUxODQ2NDE2NX0.mGjmxK4daqkC5gg6v45UBD73oEwhCTaGyZOw6_IijXo' // Feb 10, 2028, 13:33

    expect(expireToken(token, 9, false)).toEqual(false)
  });
});
