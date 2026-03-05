import memberStore from './memberStore';
import attendanceStore from './attendanceStore';
import dashboardStore from './dashboardStore';
import authStore from './authStore';

const stores = {
  memberStore,
  attendanceStore,
  dashboardStore,
  authStore,
};

export { memberStore, attendanceStore, dashboardStore, authStore };
export default stores;
