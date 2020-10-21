// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
      // 1 获取点击的索引
      const {index} = e.currentTarget.dataset
      // 2 触发 父组件中的事件 自定义
      // 自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项：
      this.triggerEvent("tabsItemChange" , {index});
    }
  }
})
