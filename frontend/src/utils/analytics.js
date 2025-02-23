import { logEvent } from 'firebase/analytics';
import { analytics } from '../config/firebase';

export const trackEvent = async (eventName, eventParams = {}) => {
  try {
    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance, eventName, eventParams);
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
};