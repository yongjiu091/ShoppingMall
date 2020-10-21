import { request } from "../../request/index";

// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[
      {
        order_id:0,
        order_number:'CD1235745866',
        order_price:999,
        create_time:1565615695
    },
    {
      order_id:1,
      order_number:'CD18974645866',
      order_price:1999,
      create_time:1565615695
  },
  {
    order_id:2,
    order_number:'CX1546498135656',
    order_price:2999,
    create_time:1565615695
},
{
  order_id:3,
  order_number:'CX98797451212',
  order_price:3999,
  create_time:1565615695
}
  ],
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo",
    tabs:[
      {
        id: 0,
        value:"全部订单",
        isActive:true  
      },
      {
        id: 1,
        value:"待付款",
        isActive:false  
      },
      {
        id: 2,
        value:"代发货",
        isActive:false  
      },
      {
        id: 3,
        value:"退款/退货",
        isActive:false  
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   * onShow 不同于 onLoad 无法在形参上接收options参数。
   */
  onShow: function () {
    const token = this.data.token;
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }

    // 1 获取当前的小程序的页面栈-数组 长度最 大是10页面
    var pages =  getCurrentPages();
    // console.log(pages);
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1];
    console.log(currentPage.options);
    // 3 获取url上的type参数
    const {type} = currentPage.options;
    // 4 激活选中当前页面标题 当 type=1 index=0
    this.changeTitleByIndex(type-1)
    this.getOrders(type);
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
      //2 修改原数组
      let {tabs}=this.data;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      //3 复制到data中
      this.setData({
        tabs
      })    
  },
  handleTabsItemChange(e){
    //1 获取被点击的标题索引
    const {index}=e.detail;
    //2 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //3 复制到data中
    this.setData({
      tabs
    })
    // 4 重新发送数据请求 type=1 index=0
    this.getOrders(index+1);
    },
  // 获取订单列表的方法
  getOrders(type){
    wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/my/orders/all',
      data: {type},
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log(result)
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})