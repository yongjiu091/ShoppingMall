// pages/goods_detail/goods_detail.js
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    //商品是否被收藏过
    isCollect:false
  },

  //商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;


    const {goods_id} = options;
    this.getGoodsDetail(goods_id);

   
  },
  

  //获取商品的详情数据
  async getGoodsDetail(goods_id){
    const res = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo = res;
     // 1 获取缓存中商品收藏的数组
     let collect = wx.getStorageSync('collect')||[];
     //2 判断当前商品是否被收藏
     let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj:{
        goods_name:res.goods_name,
        goods_price:res.goods_price,
        // 通过正则，将webp图片格式，修改为jpg格式
        goods_introduce:res.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.pics
      },
      isCollect
    })
  },
  //点击轮播图 放大预览
  handlePreviewImage(e){
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current:current,
      urls: urls,
    })
  },
  //点击加入购物车
  handleCartAdd(){
        //1 获取缓存中的购物车数组
        let cart = wx.getStorageSync('cart')||[];
        //2 判断 商品对象是否存在于购物车数组中
        let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
        if(index===-1){
          //3 不存在 第一次添加
          this.GoodsInfo.num=1;
          this.GoodsInfo.checked = true;
          cart.push(this.GoodsInfo)
        }else{
          //4 已经存在购物车数据 执行 num++
          cart[index].num++;
        }
        //5 把购物车重新添加回缓存中
        wx.setStorageSync('cart', cart);
        //6 弹窗提示
        wx.showToast({
          title: '加入成功',
          icon: 'success',
          mask: true,//防触碰
        })
  },
  //点击商品收藏
  handleCollect(){
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect')||[];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3 当index != -1 表示已经收藏过
    if(index!==-1){
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index,1);  //(删除的索引，删除1个)
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    //5 修改data中的属性 isCollect
    this.setData({isCollect})
  }
})