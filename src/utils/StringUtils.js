export default {
  nextChar: function (c) {
    return String.fromCharCode(c.charCodeAt(0) + 1)
  },
  makeLexiNext: function (c) {
    return c.slice(0, -1) + this.nextChar(c.substr(c.length - 1))
  },
  capitalize: function (c) {
    return c.replace(/\b\w/g, l => l.toUpperCase())
  },
  isEmail (email) {
    if (typeof email !== 'string') {
      return false
    }
    // There must at least one character before the @ symbol and another after.
    let re = /^[^@]+@[^@]+$/
    return re.test(email)
  },
  reformEmail (email) {
    return email.replace(/\./g, ',')
  },
  translateEmail (email) {
    return email.replace(/,/g, '.')
  }
}
