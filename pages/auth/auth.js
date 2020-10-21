// pages/auth/auth.js
import { request } from "../../request/index.js"
import {login}from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //获取用户信息
  async handleGetUserInfo(e){
  try {
    //获取用户信息
  const {encryptedData,rawData,iv,signature} = e.detail;
  //获取小程序登录成功后的code
  const {code} = await login();
  console.log(code);
  
  const loginParams = {encryptedData,rawData,iv,signature,code}
  //发送请求， 获取用户token
  const res = await request({url:"/users/wxlogin",data:loginParams,method:"POST"});
  console.log("token值："+res);
  //获取不到token，先写死
  const token1 = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
  wx.setStorageSync('token', token1);
  wx.navigateBack({
    delta: 1,
  })
  } catch (error) {
    console.log(error);
    
  }
  }

})