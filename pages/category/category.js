import {request} from "../../request/index.js"
// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList:[],
    rightContent:[],
    //被点击的左侧的菜单
    currentIndex:0,
    //滚动距离顶部的值
    scrollTop:0
  },

  //接口返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取本地缓存中的数据
    const Cates = wx.getStorageSync('cates');
    //判断
    if(!Cates){
      this.getCates();
    }else{
      //有旧数据，判断是否过期，定义过期时间
      if(Date.now()-Cates.time>1000*10){
        //重新发送请求
        this.getCates();
      }else{
        this.Cates = Cates.data;

      //构造左侧的大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name)
      //构造右侧的商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
      }
    }
  },
  //获取分类数据
  async getCates(){
    // request({
    //   url:"/categories"
    // })
    // .then(res => {
    //   // console.log(res)
    //   this.Cates = res.data.message;
 
    //   //吧接口数据存入到缓存中
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})

    //   //构造左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name)
    //   //构造右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    //1、使用es7的async await 来发送请求
    const res = await request({ url:"/categories"});
    
      // this.Cates = res.data.message;
      // 在request中通过直接.data.message，简化代码
      this.Cates = res;
 
      //吧接口数据存入到缓存中
      wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})

      //构造左侧的大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name)
      //构造右侧的商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
  
})