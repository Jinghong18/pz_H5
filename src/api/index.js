import request from '../utils/request'

export default {
    login(data) {
        return request.post('/login', data)
    },
    // 首页数据
    index() {
        return request.get('/Index/index')
    }
}