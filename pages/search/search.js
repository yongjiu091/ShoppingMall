import { request } from "../../request/index";

// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    //输入框的值
    inputValue:""
  },
  //定时器初始化
  TimeId:-1,

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
   */
  onShow: function () {

  },

  //输入框值改变，就会触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value}=e.detail;
    // 2 检查合法性 .trim()用于去除两端空白字符
    if(!value.trim()){ 
      // 值不合法
      this.setData({
        goods:[],
        isFocus:false,
        inputValue:"",
      })
      return;
    }
    // 显示取消按钮
    this.setData({
      isFocus:true
    })
    // 3 准备发送请求获取数据
      //利用定时器，实现防抖功能，减少发送请求次数。
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    }, 1000)
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query){
    const res = await request({
      url:"/goods/qsearch",
      data:{query}
    });
    this.setData({goods:res})
  },
  // 点击取消按钮
  handleCancel(){
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    })
  }
})