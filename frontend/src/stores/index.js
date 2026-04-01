import memberStore from './memberStore';
import attendanceStore from './attendanceStore';
import dashboardStore from './dashboardStore';
import authStore from './authStore';
import qaStore from './qaStore';

const stores = {
  memberStore,
  attendanceStore,
  dashboardStore,
  authStore,
  qaStore,
};

export { memberStore, attendanceStore, dashboardStore, authStore, qaStore };
export default stores;
