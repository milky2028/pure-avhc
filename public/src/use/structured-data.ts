import { onBeforeUnmount } from '@vue/composition-api';
import Product from '@/types/Product';
import Size from '@/types/Size';
import removeTags from '../functions/removeTags';

export default function useStructuredData() {
  async function setStructuredData(structuredData: { [key: string]: any }) {
    const data = JSON.stringify(structuredData);
    const existingStructuredData = [
      ...document.getElementsByTagName('script')
    ].find(
      (el) => el.type === 'application/ld+json' && el.textContent === data
    );

    if (!existingStructuredData) {
      const purifier = await import('dompurify');
      const structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.textContent = purifier.sanitize(data);
      document.head.insertAdjacentElement('beforeend', structuredDataScript);
    }
  }

  function clearStructuredData() {
    const allScripts = document.getElementsByTagName('script');
    for (const script of allScripts) {
      if (script.type === 'application/ld+json' && script.id !== 'logo') {
        script.remove();
      }
    }
  }

  function createProductStructuredData(
    product: Product,
    url: string,
    size: Size
  ) {
    const organizationName = process.env.VUE_APP_FULL_NAME;
    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: url,
      description: removeTags(product.description),
      brand: organizationName,
      sku: product.id,
      mpn: product.id,
      review: [
        {
          '@type': 'Review',
          name: 'Their products work',
          reviewBody:
            "Their products work, I use the pain cream for back pain daily and arthritis, very helpful. They're very good at getting back to me with clear explanations of their products. First class company and people. Thanks, Diane",
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5'
          },
          datePublished: '2019-06-03',
          author: { '@type': 'Person', name: 'Diane S' },
          publisher: { '@type': 'Organization', name: 'Trustpilot' }
        },
        {
          '@type': 'Review',
          name: 'Pure CBD Exchange, the best place to get cbd',
          reviewBody:
            'Pure CBD Exchange really impressed me all around. From the packaging, to the quality of the product. This is the only place I would recommend to anyone looking to buy cbd.',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5'
          },
          datePublished: '2019-03-12',
          author: { '@type': 'Person', name: 'John Lewis' },
          publisher: { '@type': 'Organization', name: 'Trustpilot' }
        },
        {
          '@type': 'Review',
          name: 'I would rate them 100 stars if i could',
          reviewBody:
            "I would rate them 100 stars if i could, I love pure CBD products I've been a customer for years and the only complaint i have is there ordering system for a while was stressful but it seems they have fixed it , other than that there products are surpassed to any other brand in potency quality and flavor I've tried many other brands but never found any other brand as great as PURE CBD , after being in multiple accidents and having a acromioplasty I found cbd as an alternative to pain pills and i belive you have helped me live a more normal life, I trust I can depend on you guys to keep me going. keep up the great work , I thank God for you guys",
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5'
          },
          datePublished: '2019-03-11',
          author: { '@type': 'Person', name: 'Alonso Solis' },
          publisher: { '@type': 'Organization', name: 'Trustpilot' }
        }
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.3',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '82'
      },
      offers: {
        '@type': 'Offer',
        url: window.location.href,
        priceCurrency: 'USD',
        price: `${size.price}`,
        priceValidUntil: '2020-06-01',
        availability: 'https://schema.org/OnlineOnly',
        itemCondition: 'https://schema.org/NewCondition'
      }
    };
  }

  onBeforeUnmount(() => clearStructuredData());

  return {
    setStructuredData,
    clearStructuredData,
    createProductStructuredData
  };
}
