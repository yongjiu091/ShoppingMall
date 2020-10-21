// pages/cart/cart.js
import {getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment}from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0,
    pay:{
      "timeStamp": "1564730510",
      "nonceStr": "SReWbt3nEmpJo3tr",
      "package": "prepay_id=wx02152148991420a3b39a90811023326800",
      "signType": "MD5",
      "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取缓存中收货地址
    const address = wx.getStorageSync('address')
    //获取缓存中购物车数据
    let cart = wx.getStorageSync('cart')||[];
    //过滤后的购物车数组
    cart = cart.filter(v=>v.checked)
    
  // 总价格 总数量
  let totalPrice = 0;
  let totalNum = 0;
  cart.forEach(v=>{
      totalPrice += v.num*v.goods_price;
      totalNum += v.num;
  })

    // 把购物车数据重新设置回data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
    
//点击支付
async handleOrderPay(){

    //1、判断缓存中有没有token
  const token = wx.getStorageSync('token')
  //2 判断
  if(!token){
    wx.navigateTo({
      url: '/pages/auth/auth',
    })
    return;
  }
  //有token，创建订单
  //3.1准备 请求头参数
  const header = {Authorization:token};
  //3.2 准备 请求体参数
  const order_price = this.data.totalPrice;
  const consignee_addr = this.data.address;
  const cart = this.data.cart;
  let goods=[];
  cart.forEach(v=>goods.push({
    goods_id:v.goods_id,
    goods_number:v.num,
    goods_price:v.goods_price
  }))
  const orderParams={order_price,consignee_addr,goods}
  // 4 准备发送请求 创建订单 获取订单编号
  const res_order_number = await request({url:"/my/orders/create",method:"POST",data:orderParams,header:header})
  // 获取不到订单编号，先写死
  const order_number = "HMDD20190802000000000422";
  console.log(order_number);
  // 5 发起 预支付的接口
  const res_pay = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:order_number,header:header});
  console.log(res_pay);
  //拿不到pay属性，先写死
  const pay = this.data.pay;
  // 6 发起微信支付
  // const res_requestPay = await requestPayment(pay);
  // console.log('res',res_requestPay);
  // 7 查询后台 订单状态
  // const res = await request({url:"/my/orders/chkOrder",method:"POST",data:order_number,header:header});
  // console.log(res);

  // 6 发起微信支付 没有接口，会失败，在失败中处理
  wx.requestPayment({
    ...pay,
    success: (res) => {},
    fail: (res) => {
      //以下代码应该写在success中，
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart)
      wx.showToast({
        title: '支付成功',

        success: (res) => {

        },
        fail: (res) => {},
        complete: (res) => {},
      });
      wx.navigateTo({
        url: '/pages/order/order',
      })

    },
    complete: (res) => {},
  })
  
}




})