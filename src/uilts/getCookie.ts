const getCookie = (cn: string) => {
    const reg = new RegExp('(^| )' + cn + '=([^;]*)(;|$)')
    const arr = document.cookie.match(reg)
    if (arr) {
        return decodeURIComponent(arr[2])
    } else {
        return ''
    }
}

export default getCookie