export const dateShow = (date) => {
    let datetime = date.replace('T', ' ').replace('Z', '').split(' ')
    let day = datetime[0]
    let time = datetime[1].substring(0, 8)
    return `${day} ${time}`
}
export const format = (str) => {
    if (str.length>15) {
        return str.slice(0, 15)+"..."
    }
    else {
        return str;
    }
}