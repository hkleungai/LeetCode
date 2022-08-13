import axios from 'axios';
import { parse as parse_cookie } from 'cookie';

import { BASE_URL } from '../constants';
import type { Nullable } from '../types';
import { is_valid_string } from '../validators';

const parse_cookie_token = (cookie: string): string | null => {
  const { csrftoken } = parse_cookie(cookie);
  return is_valid_string(csrftoken) ? csrftoken : null;
}

const get_token = async (cookie?: string): Promise<Nullable<string>> => {
  // Get token from cookie in env,
  // or else get "anonymous" token by visiting the site.
  if (cookie) {
    const token = parse_cookie_token(cookie);
    if (token) {
      return token;
    }
  }
  try {
    const response = await axios.get(BASE_URL);
    const set_cookie = response.headers['set-cookie'];
    if (!set_cookie || !set_cookie.length) {
      return null;
    }
    const [header_cookie] = set_cookie;
    return parse_cookie_token(header_cookie);
  } catch (error) {
    console.error(error as Error);
    return null;
  }
};

export default get_token;
