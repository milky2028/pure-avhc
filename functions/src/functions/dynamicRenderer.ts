import * as functions from 'firebase-functions';

function isBot(userAgent: string) {
  const bots = [
    // search engine crawler bots
    'googlebot',
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

  return bots.includes(userAgent.toLowerCase());
}

const dynamicRenderer = functions.https.onRequest((req, res) => {
  const userAgent = req.headers['user-agent'];
  return res.status(200).send(`
    <!doctype html>
      <head>
        <title>Dummy Dynamic Render Page</title>
      </head>
      <body>
        <p>Are you a bot?</>
        <p>${isBot(userAgent as string)}</p>
      </body>
  `);
  // if (userAgent && isBot(userAgent)) {
  // } else {
  // }
});

export default dynamicRenderer;
