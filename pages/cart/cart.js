// pages/cart/cart.js
import {getSetting,chooseAddress,openSetting,showModal,showToast}from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
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
    const cart = wx.getStorageSync('cart')||[];
    
    this.setData({address});
    this.setCart(cart);
  },
    
  /**
   * 下面代码，是判断是否授权的思路，改版后收货地址无需授权，可直接获取
   */
  // 获取收货地址 
async handleChooseAddress(){
  try {
      //1 获取权限状态
  const res1 = await getSetting();
  console.log(res1);
  
  const scopeAddress = res1.authSetting["scope.address"];
  //2 判断权限状态
  if (scopeAddress === true || scopeAddress === undefined){
    // 3 调用获取收货地址的api
    const res2 = await chooseAddress();
    console.log(res2);
    // 4、存入缓存
    wx.setStorageSync('address', res2)
  }else{
    //失败后（改版后不会失败）诱导用户打开授权界面
    await openSetting();
    // 3 调用获取收货地址的api
    const res2 = await chooseAddress();
    console.log(res2);
    
  }
  } catch (error) {
    console.log(error);
    
  }
},

//商品的选中
handleItemChange(e){
  // 获取被修改的商品的id
  const goods_id = e.currentTarget.dataset.id
  // 获取购物车数组
  let {cart} = this.data;
  // 找到被修改的商品对象
  let index = cart.findIndex(v=>v.goods_id===goods_id);
  //选中状态取反
  cart[index].checked =!cart[index].checked;

  this.setCart(cart);
},
//设置购物车状态，同时重新计算全选、总价格等
 setCart(cart){
  const allChecked = cart.length?cart.every(v=>v.checked):false;

  // 总价格 总数量
  let totalPrice = 0;
  let totalNum = 0;
  cart.forEach(v=>{
    if(v.checked){
      totalPrice += v.num*v.goods_price;
      totalNum += v.num;
    }
  })

    // 把购物车数据重新设置回data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('cart', cart);
 },
 //商品的全选功能
 handleItemAllCheck(){
   //获取data中的数据
   let {cart,allChecked}=this.data;
   //修改值
   allChecked = !allChecked;
   //循环修改cart数组
   cart.forEach(v=>v.checked=allChecked)
   //把修改后的值填充回data或缓存中
   this.setCart(cart);
 },

//商品数量编辑
   async handleItemNumEdit(e){
    // 1 获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart} = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id);
    // 4 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){

      // 4.1 Promise形式弹窗提示
      const res =await showModal({content:"您是否要删除？"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      } 
    }else{

      // 4 进行修改数量
      cart[index].num+=operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
  },

  //结算
  async handlePay(){
    //判断收货地址
    const{address,totalNum} = this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    //判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    //跳转支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  }
})