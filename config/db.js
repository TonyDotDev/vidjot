if (process.env.NODE_ENV === 'production') {
  module.exports = { mongoURI: 'mongodb://RPJCK(t~b2H3XFZt:MYsL^7R+sMpbp73T@ds241699.mlab.com:41699/vidjot-prod'};
} else {
  module.exports = { mongoURI: 'mongodb://localhost:27017/vidjot-dev'}
};