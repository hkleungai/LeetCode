import get_token from './get_token';
import { ALL_PROBLEM_URL } from '../constants';
import { AxiosInstance } from 'axios';

const Constructor = async (axios_instance: AxiosInstance, cookie?: string) => {
  const token = await get_token(cookie);
  if (!token) {
    throw new Error('Token cannot be retrieved');
  }
  axios_instance.defaults.headers.post = {
    cookie: cookie || '',
    'content-type': 'application/json',
    credentials: 'include',
    mode: 'cors',
    referrer: ALL_PROBLEM_URL,
    referrerPolicy: 'strict-origin-when-cross-origin',
    'x-csrftoken': token,
  };
  if (cookie) {
    axios_instance.defaults.headers.post.cookie = cookie;
  }
}

export default Constructor;
