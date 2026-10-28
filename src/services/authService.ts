import { Role, UserSession } from '../types';

const SESSION_KEY = 'mms_active_session';

const DEFAULT_SESSION: UserSession = {
  isLoggedIn: true,
  role: 'admin',
  name: 'মাওলানা আহমাদুল্লাহ',
  mobile: '01712345678',
  institutionName: 'দারুল উলুম আল-ইসলামিয়া মাদরাসা ও হিফজখানা',
  institutionCode: 'MMS-786'
};

export const authService = {
  getSession(): UserSession {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : DEFAULT_SESSION;
    } catch {
      return DEFAULT_SESSION;
    }
  },

  setRole(role: Role): void {
    const session = this.getSession();
    session.role = role;
    if (role === 'admin') session.name = 'মাওলানা আহমাদুল্লাহ (মুহতামিম)';
    if (role === 'accountant') session.name = 'হাফেজ কায়সার (হিসাবরক্ষক)';
    if (role === 'teacher') session.name = 'ক্বারী হাবিবুর রহমান (হিফজ উস্তাদ)';
    if (role === 'guardian') session.name = 'অভিভাবক অতিথি ভিউ';
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  login(mobile: string, role: Role = 'admin'): UserSession {
    const session: UserSession = {
      isLoggedIn: true,
      role,
      name: role === 'admin' ? 'মুহতামিম সাহেব' : 'অফিস ইউজার',
      mobile,
      institutionName: 'দারুল উলুম আল-ইসলামিয়া মাদরাসা ও হিফজখানা',
      institutionCode: 'MMS-786'
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout(): void {
    const session = this.getSession();
    session.isLoggedIn = false;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
};
