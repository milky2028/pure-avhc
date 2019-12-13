type EventCategories = 'Orders' | 'Performance' | 'Engagement';
interface GoogleAnalyticsEvent {
  eventCategory: EventCategories;
  eventAction: string;
  eventLabel: string;
  eventValue: number;
}

declare function ga(
  action: 'send',
  type: 'event',
  eventData: Partial<GoogleAnalyticsEvent>
): () => void;

export default function useAnalytics() {
  function sendAnalyticsEvent(eventData: Partial<GoogleAnalyticsEvent>) {
    ga('send', 'event', eventData);
  }

  return { sendAnalyticsEvent };
}
