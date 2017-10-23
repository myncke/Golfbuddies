export default {
  nextChar: function (c) {
    return String.fromCharCode(c.charCodeAt(0) + 1)
  },
  makeLexiNext: function (c) {
    return c.slice(0, -1) + this.nextChar(c.substr(c.length - 1))
  },
  capitalize: function (c) {
    return c.replace(/\b\w/g, l => l.toUpperCase())
  }
}
