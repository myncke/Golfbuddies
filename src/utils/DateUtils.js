
export default {
  dateToString: function (timestamp) {
    let date = new Date(timestamp)
    let hours = '0' + date.getHours()
    let minutes = '0' + date.getMinutes()
    let seconds = '0' + date.getSeconds()
    let day = '0' + date.getDay()
    let month = '0' + date.getMonth()
    let year = date.getFullYear()

    // Will display time in 10:30:23 format
    return day.substr(-2) + '/' + month.substr(-2) + '/' + year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
  }
}
