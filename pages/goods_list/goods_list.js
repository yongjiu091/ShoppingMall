import { request } from "../../request/index.js"

// pages/goods_list/goods_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  //接口要的数据
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();
  },

  //总页数初始化
  totalPages:1,

  //获取商品列表数据
  async getGoodsList(){
    const res = await request({ url:"/goods/search",data:this.QueryParams});
    // console.log(res);
    //获取数据总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
    
    
    this.setData({
      //goodsList:res.goods
      //对数据进行拼接
      goodsList:[...this.data.goodsList,...res.goods]
    })
    
    //关闭下拉刷新
    wx.stopPullDownRefresh();
  },
  //标题点击事件，从子组件传递过来
  handleTabsItemChange(e){
    //1、获取被点击的标题索引
    const {index}=e.detail;
    //2、修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //3、赋值到data中
    this.setData({tabs})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    //判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages){
      //没有下一页数据
      console.log('没有下一页')
      wx.showToast({
        title: '我是有底线的',
      })
    }else{
      //有下一页数据
      // console.log('还有下一页')
      this.QueryParams.pagenum ++;
      // console.log(that.QueryParams.pagenum)
      this.getGoodsList();
      
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //下拉刷新事件
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.QueryParams.pagenum = 1;
    //发送请求
    this.getGoodsList();
  },

})