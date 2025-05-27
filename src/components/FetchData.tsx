import { SERVER } from '../services/ApiUrls';

export const Header = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // fix key and add Bearer
  org: localStorage.getItem('org'),
};

export const Header1 = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
};

export function fetchData(
  url: any,
  method: any,
  data: object | string = '',
  header: any
) {
  const options: RequestInit = {
    method,
    headers: header,
  };

  if (method !== 'GET' && data) {
    options.body = typeof data === 'string' ? data : JSON.stringify(data);
  }

  return fetch(`${SERVER}${url}`, options).then(async (response) => {
    // Optional: check for HTTP error codes before parsing json
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }
    return response.json();
  });
}
