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
    },
    // 陪诊师列表 /companion/list
    h5CompanionList (data) {
        return request.get('/companion/list', { params: data })
    },
    // 提交订单
    createOrder (data) {
        return request.post('/createOrder', data)
    },
    // 订单列表
    orderList (data) {
        return request.get('/order/list', { params: data })
    },
    // 订单详情
    orderDetail (params) {
        return request.get('/order/detail', { params: params })
    }
}