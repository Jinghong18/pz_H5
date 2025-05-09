<template>
    <div class="container">
        <!-- 头部 -->
        <div class="header">
            <van-icon @click="goBack" name="arrow-left" class="header-left" size="30" />
            订单详情
        </div>
        <StatusBar :item="stateMap[detailData.trade_state]" />
        <!-- 订单状态 -->
        <div class="tips">
            <!-- 待支付 -->
            <div class="dzf" v-if="detailData.trade_state === '待支付'">
                <div class="text1">订单待支付</div>
                <div class="text2">
                    请在
                    <Counter :second="second" />
                    内完成支付，否则订单将自动取消。
                </div>
                <div class="text3">
                    <van-button type="success" @click="showCode = true">
                        立即支付(0.01元)
                    </van-button>
                </div>
            </div>

            <!-- 待服务 -->
            <div class="dzf" v-if="detailData.trade_state === '待服务'">
                <div class="text1">正在为您安排服务专员...</div>
                <div class="text2">请保持手机通畅，稍后将有服务专员与您联系。</div>
            </div>

            <!-- 已完成 -->
            <div class="dzf" v-if="detailData.trade_state === '已完成'">
                <div class="text1">服务已完成</div>
                <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
            </div>

            <!-- 已取消 -->
            <div class="dzf" v-if="detailData.trade_state === '已取消'">
                <div class="text1">订单已取消</div>
                <div class="text2">期待下次为您服务，如需帮助可咨询客服。</div>
            </div>
        </div>

        <!-- 支付二维码弹窗 -->
        <van-dialog v-model:show="showCode" :show-confirm-button="false">
            <van-icon name="cross" class="close" @click="closeCode" />
            <div>微信支付</div>
            <van-image :src="codeImg" width="150" height="150" />
            <div>请使用微信扫码支付</div>
        </van-dialog>

        <!-- 预约信息 -->
        <van-cell-group class="card">
            <div class="header-text">预约信息</div>
            <van-cell v-for="(item,key) in makeInfo" :key="key" :title="item" :value="formatData(key)" />
        </van-cell-group>

        <!-- 订单信息 -->
        <van-cell-group class="card">
            <div class="header-text">预约信息</div>
            <van-cell v-for="(item,key) in orderInfo" :key="key" :title="item" :value="formatData(key)" />
        </van-cell-group>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from "vue";
import Counter from '../../components/counter.vue'
import { useRouter, useRoute } from 'vue-router'
import StatusBar from '../../components/statusBar.vue'
import Qrcode from 'qrcode'

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance();

// 详情页数据
const detailData = reactive({})
const stateMap = {
    '待支付': 10,
    '待服务': 20,
    '已完成': 30,
    '已取消': 40,
}
onMounted(async () => {
    const { data } = await proxy.$api.orderDetail({ oid: route.query.oid })
    Object.assign(detailData, data.data)
    Qrcode.toDataURL(data.data.code_url).then((url) => {
        codeImg.value = url
    })
})

// 点击返回
const goBack = () => {
    router.go(-1)
}

// 计算倒计时
const second = computed(() => {
    return detailData.order_start_time ? detailData.order_start_time + 7200000 - Date.now() : 0
})

// 支付二维码弹窗
const showCode = ref(false)
const codeImg = ref('')
const closeCode = () => {
    showCode.value = false
    router.push('/order')
}

// 预约信息
const makeInfo = {
    service_name: '预约服务',
    hospital_name: '就诊医院',
    starttime: '期望就诊时间',
    'client.name': '就诊人',
    'client.mobile': '就诊人电话',
    receiveAddress: '接送地址',
    demand: '其他需求',
}
const orderInfo = {
    tel: '就诊人电话',
    order_start_time: '下单时间',
    price: '应付金额',
    out_trade_no: '订单编号',
}

const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    if (key === "order_start_time") {
      return formatTimestamp(detailData[key]);
    }
    return detailData[key];
  }
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, detailData);
  return arr;
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
</script>

<style scoped lang="less">
.container {
    background-color: #f0f0f0;
    height: 100vh;
}

.header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;

    .header-left {
        float: left;
    }
}

.card {
    margin: 15px 0;
    padding: 10px;

    .header-text {
        padding-left: 5px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        border-left: 4px solid red;
    }
}

.dzf {
    padding: 20px;

    .text1 {
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        color: #666;
    }

    .text2 {
        font-size: 14px;
        color: #666;
    }

    .text3 {
        text-align: center;

        .van-button {
            margin-top: 10px;
            margin-left: 10px;
            width: 80%;
            font-weight: bold;
        }
    }
}

::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;

    .close {
        position: absolute;
        left: 20px;
    }
}
</style>