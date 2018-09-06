//mock api
import fetchMock from "fetch-mock";

fetchMock.mock('http://alexcheung.com/GetUserInfo', {
    status: 1,
    data: {
        list: [1, 2 ,3]
    },
    msg: '获取成功'
})



export default  {
    async getUserinfo() {
        var res = await fetch('http://alexcheung.com/GetUserInfo')
        res = await res.json()
        if (res && res.status && res.data) {
            return res.data
        }
    }
}