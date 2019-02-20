// component/topBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    barBgc: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 'linear-gradient(to right, #07CBC1, #02B6D7)' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    showBack: {
      type: Boolean,
      value: true
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
    navigateBack: function() {
      // var self = this;
      var pages = getCurrentPages();
      if (pages.length == 1) {
        // 当前是在返回链的最顶层，无法再返回
        // if (self.data.circleId && self.data.circleId > 0) {
        //   wx.redirectTo({
        //     url: '../../circle/index/index?circleId=' + self.data.circleId +
        //       '&circleName=' + (self.data.circleName || '')
        //   });
        // } else {
        //   wx.switchTab({
        //     url: "../../home/grouplist/grouplist"
        //   });
        // }
      } else {
        wx.navigateBack({
          changed: true
        }); //返回上一页
      }
    }
  }
})