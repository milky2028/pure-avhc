import * as functions from 'firebase-functions';
import axios from 'axios';

function isBot(userAgent: string) {
  const bots = [
    // search engine crawler bots
    'googlebot',
    'google-structured-data-testing-tool',
    'bingbot',
    'mediapartners-google',
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

const dynamicRenderer = functions.https.onRequest(async (req, res) => {
  const userAgent = req.headers['user-agent'];
  // res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  if (userAgent && isBot(userAgent)) {
    return res.status(200).send(`
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Dynamic Renderer</title>
        </head>
        <body>
          <p>Are you a bot?</p>
          <p>${isBot(userAgent as string)}</p>
        </body>
        </html>
      `);
  } else {
    const pageResponse = await axios.get(
      `https://${req.headers.host}/${req.originalUrl}`
    );
    return res.status(200).send(pageResponse.data);
  }
});

export default dynamicRenderer;
