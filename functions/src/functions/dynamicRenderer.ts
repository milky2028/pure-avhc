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
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
      <p>Are you a bot?</>
      <p>${isBot(userAgent as string)}</p>
    </body>
    </html>
  `);
  // if (userAgent && isBot(userAgent)) {
  // } else {
  // }
});

export default dynamicRenderer;
