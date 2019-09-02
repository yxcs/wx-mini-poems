// pages/Scroll-to-del/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listName: {
      type: String,
      value: 'list'
    },
    btnWidth: {
      type: Number,
      value: 150
    },
    pos: {
      type: Number,
      value: 0
    },
    itemId: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    startX: '',
    startY: '',
    delBtnWidth: ''
  },

  lifetimes: {
    attached () {
      this.getRealWidth(this.data.btnWidth)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // rpx 转为px，因为滑动事件获取的x,y单位为px
    getRealWidth: function (w) {
      let real = 0;
      try {
        let res = wx.getSystemInfoSync().windowWidth;
        let scale = (750 / 2) / (w / 2);
        real = Math.floor(res / scale);
        this.setData({ delBtnWidth: real });
      } catch (e) {
        return false;
      }
    },
    onTouchStart(e) {
      if (e.touches.length === 1) {
        this.triggerEvent('changelist', {listName: this.data.listName, type: 'start'})
        this.setData({
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY
        });
      }
    },
    onTouchMove(e) {
      if (e.touches.length == 1) {
        let moveX = e.touches[0].clientX; // 当前手指移动到的位置
        let disX = this.data.startX - moveX;
        let delBtnWidth = this.data.delBtnWidth;
        let leftPos = '';
        if (disX <= 0) {  // 如果移动距离小于等于0，说明向右滑动，文本层位置不变
          leftPos = 0;
        } else {
          if (disX >= delBtnWidth) {
            leftPos = -delBtnWidth; // 控制手指移动距离最大值为删除按钮的宽度
          } else {
            leftPos = -disX; // 移动距离大于0, 小于按钮宽度，文本层left值等于手指移动距离
          }
        }

        let moveY = e.touches[0].clientY;
        if (Math.abs(moveY - this.data.startY) > 50) {
          leftPos = 0;
        }

        this.triggerEvent('changelist', {listName: this.data.listName, type: 'start', itemId: this.data.itemId, leftPos: leftPos})
      }
    },
    onTouchEnd(e) {
      if (e.changedTouches.length == 1) {
        let endX = e.changedTouches[0].clientX;
        let disX = this.data.startX - endX;
        let delBtnWidth = this.data.delBtnWidth;
        let leftPos = disX > delBtnWidth / 2 ? -delBtnWidth : 0;  // 如果距离小于删除按钮的1/2，不显示删除按钮

        let moveY = e.changedTouches[0].clientY;
        if (Math.abs(moveY - this.data.startY) > 50) {
          leftPos = 0;
        }

        this.triggerEvent('changelist', {listName: this.data.listName, type: 'end', itemId: this.data.itemId, leftPos: leftPos})
      }
    },
    // 删除操作
    deleteItem(e) {
      this.triggerEvent('changelist', {listName: this.data.listName, type: 'delete', itemId: this.data.itemId})
    }
  }
})
