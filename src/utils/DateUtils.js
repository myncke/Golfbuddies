
export default {
  dateToString: function (timestamp) {
    let date = new Date(timestamp)
    let hours = '0' + date.getHours()
    let minutes = '0' + date.getMinutes()
    let seconds = '0' + date.getSeconds()
    let day = '0' + date.getDay()
    let month = '0' + date.getMonth()
    let year = date.getFullYear()

    return day.substr(-2) + '/' + month.substr(-2) + '/' + year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
  },

  stringToDate: function (string) {
    let result = new Date()

    console.log(string.slice(4, 8))
    result.setFullYear(string.slice(4, 8), string.slice(2, 4) - 1, string.slice(0, 2))
    result.setHours(string.slice(8, 10), string.slice(10, 12), 0, 0)

    console.log(result.toUTCString())

    return result
  },
  addDays (amount, date) {
    date.setDate(date.getDate() + amount)
    return date
  }
}
