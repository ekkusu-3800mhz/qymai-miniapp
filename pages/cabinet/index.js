const { callContainer } = require("../../utils/functions.js");

const app = getApp();

Page({

    data: {
        cabinetList: [],
    },

    async onShow() {
        wx.startPullDownRefresh();
        try {
            let res = await callContainer("/queue/list", "GET");
            if (res.data.status === 200) {
                wx.stopPullDownRefresh();
                this.setData({
                    cabinetList: res.data.data.cabinetList,
                });
            } else {
                wx.stopPullDownRefresh();
                wx.showModal({
                    title: '加载失败',
                    content: `HTTP ${res.data.status}`,
                    showCancel: false,
                });
            }
        } catch (err) {
            wx.stopPullDownRefresh();
            wx.showModal({
                title: '加载失败',
                content: `云服务启动中，请稍后再进入小程序`,
                showCancel: false,
            });
        };
    },

    async onPullDownRefresh() {
        try {
            let res = await callContainer("/queue/list", "GET");
            if (res.data.status === 200) {
                wx.stopPullDownRefresh();
                this.setData({
                    cabinetList: res.data.data.cabinetList,
                });
            } else {
                wx.stopPullDownRefresh();
                wx.showModal({
                    title: '加载失败',
                    content: `HTTP ${res.data.status}`,
                    showCancel: false,
                });
            }
        } catch(err) {
            wx.stopPullDownRefresh();
            wx.showModal({
                title: '加载失败',
                content: `云服务启动中，请稍后再进入小程序`,
                showCancel: false,
            });
        };
    },

});
