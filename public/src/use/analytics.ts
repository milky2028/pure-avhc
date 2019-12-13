type EventCategories = 'Orders' | 'Performance' | 'Engagement';
interface GoogleAnalyticsEvent {
  eventCategory: EventCategories;
  eventAction: string;
  eventLabel: string;
  eventValue: number;
}

declare const dataLayer: any[];

declare function ga(
  action: 'send',
  type: 'event',
  eventData: Partial<GoogleAnalyticsEvent>
): () => void;

export default function useAnalytics() {
  function sendAnalyticsEvent(eventData: Partial<GoogleAnalyticsEvent>) {
    ga('send', 'event', eventData);
  }

  function sendEcommerceEvent(event: string, type: string, product: string) {
    dataLayer.push({
      event,
      ecommerce: {
        currencyCode: 'USD',
        [type]: {
          products: [
            {
              name: product
            }
          ]
        }
      }
    });
  }

  return { sendAnalyticsEvent, sendEcommerceEvent };
}
