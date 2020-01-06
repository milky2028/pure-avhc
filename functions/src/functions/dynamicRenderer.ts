import * as functions from 'firebase-functions';
import axios from 'axios';
import * as admin from 'firebase-admin';

function isBot(userAgent: string) {
  const bots = [
    // search engine crawler bots
    'googlebot',
    'google-structured-data-testing-tool',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    // social media link bots
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkshare',
    'facebot',
    'outbrain',
    'w3c_validator'
  ];

  for (const bot of bots) {
    if (userAgent.toLowerCase().includes(bot)) {
      return true;
    }
  }

  return false;
}

const dynamicRenderer = (functionTarget: string) =>
  functions.https.onRequest(async (req, res) => {
    const domain =
      functionTarget === 'avhc'
        ? 'aspenvalleycbd.com'
        : 'pure-e0325.firebaseapp.com';
    const userAgent = req.headers['user-agent'];
    // res.set('Cache-Control', 'public, max-age=31536000, s-maxage=86400');
    // res.set('Vary', 'User-Agent');
    if (userAgent && isBot(userAgent)) {
      const pageRenderData = (
        await admin
          .firestore()
          .collection('pageRenders')
          .doc(encodeURIComponent(`https://${domain}${req.originalUrl}`))
          .get()
      ).data();
      if (pageRenderData) {
        return res.status(200).send(pageRenderData.render);
      }
    }
    const pageResponse = await axios.get(`https://${domain}/index.html`);
    return res.status(200).send(pageResponse.data);
  });

export default dynamicRenderer;
