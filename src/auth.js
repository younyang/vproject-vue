/* globals localStorage */
export default {
  getToken () {
    return sessionStorage.token;
  },

  getUserInfo (key) {
    return sessionStorage.getItem(key)
  },

  logout (callback) {
    delete sessionStorage.token;
    if (callback) callback()
  },

  loggedIn () {
    return !!sessionStorage.token
  },

  onChange () {}
}


