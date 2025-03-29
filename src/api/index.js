import request from '../utils/request'

export default {
    login(data) {
        return request.post('/login', data)
    },
    // 首页数据
    index() {
        return request.get('/Index/index')
    },
    // 订单详情
    h5Companion () {
        return request.get('/h5/companion')
    }
}