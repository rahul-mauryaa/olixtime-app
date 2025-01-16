import { DEVELOPMENT_URL , PRODUCTION_URL } from '@env'

const Base_URL = `${PRODUCTION_URL}`;

export const URL = {
  Base_URL,
  LOGIN: Base_URL + "user/login",
  LOGINME:Base_URL + "user/me",
  // User profile
  LEAVE_APPLICATIONS: Base_URL + "user/leave/applications",
  REQUEST_LEAVE: Base_URL + "user/request-leave",
  UPDATE_USER: Base_URL + "user/me",
};
