/* globals localStorage */
export default {
  getToken () {
    return localStorage.token;
  },

  getUserInfo (key) {
    return localStorage.getItem(key)
  },

  logout (callback) {
    delete localStorage.token;
    if (callback) callback()
  },

  loggedIn () {
    return !!localStorage.token
  },

  onChange () {}
}


