const http = require('axios')
const API = MAIN_CONFIH.API_ROOT

export default {
    async getUserInfo() {
        var result = await http.get(API + 'GetUserInfo?id=1');
        if (result && result.status === 200 && result.data) return result.data
    }
}