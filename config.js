exports.twitter_auth = { consumerKey: process.env.CONSUMER_KEY ? process.env.CONSUMER_KEY : '<key>'
                       , consumerSecret: process.env.CONSUMER_SECRET ? process.env.CONSUMER_SECRET : '<secret>'
                       , callbackURL: process.env.CALLBACK_URL ? process.env.CALLBACK_URL : '<callback url>' };

exports.db = { uri: process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://<mongo host>:<mongo port>/<db name>'
             , user: process.env.MONGO_USER ? process.env.MONGO_USER : '<mongo user>'
             , pass: process.env.MONGO_PASS ? process.env.MONGO_PASS : '<user password>' };

exports.rabbitmq = { host: process.env.RABBITMQ_HOST ? process.env.RABBITMQ_HOST : 'rabbitmq.host' };

exports.ironio = { token: process.env.IRONIO_TOKEN ? process.env.IRONIO_TOKEN : '<ironio oauth token>'
                 , id: process.env.IRONIO_ID ? process.env.IRONIO_ID : '<ironio project id>'};

exports.session_secret = process.env.SESSION_SECRET ? process.env.SESSION_SECRET : '<session secret>';

exports.title = process.env.TITLE ? process.env.TITLE : 'Shell Golf';

exports.authors = process.env.AUTHORS ? process.env.AUTHORS : 'ApertureHacks';
