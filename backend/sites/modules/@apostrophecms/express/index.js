export default {
  options: {
    // So baseUrl can be autodetected when behind nginx
    trustProxy: true
    // The session secret is shared by all sites. Multisite sets it from the
    // `sessionSecret` option in backend/app.js.
  }
};
