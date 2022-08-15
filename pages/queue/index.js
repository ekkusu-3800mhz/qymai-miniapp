const { callContainer, calculateDistance } = require("../../utils/functions.js");

const app = getApp();

Page({

    data: {
        cabinetList: [],
    },

    async onShow() {
        wx.startPullDownRefresh();
        try {
            let locationStr = `${app.globalData.userLocation.latitude},${app.globalData.userLocation.longitude}`;
            let res = await callContainer("/queue/list", "GET");
            if (res.data.status === 200) {
                let cabinetList = res.data.data.cabinetList;
                let filtered = [];
                for (let i = 0; i < cabinetList.length; i++) {
                    let distance = await calculateDistance(locationStr, cabinetList[i].shop.location);
                    if (distance < 200) {
                        filtered.push(cabinetList[i]);
                    }
                }
                this.setData({
                    cabinetList: filtered,
                });
            } else {
                wx.showModal({
                    title: '加载失败',
                    content: `HTTP ${res.data.status}`,
                    showCancel: false,
                });
            }
            wx.stopPullDownRefresh();
        } catch (e) {
            wx.stopPullDownRefresh();
            console.error(e);
        }
    },

    async onPullDownRefresh() {
        try {
            let locationStr = `${app.globalData.userLocation.latitude},${app.globalData.userLocation.longitude}`;
            let res = await callContainer("/queue/list", "GET");
            if (res.data.status === 200) {
                let cabinetList = res.data.data.cabinetList;
                let filtered = [];
                for (let i = 0; i < cabinetList.length; i++) {
                    let distance = await calculateDistance(locationStr, cabinetList[i].shop.location);
                    if (distance < 200) {
                        filtered.push(cabinetList[i]);
                    }
                }
                this.setData({
                    cabinetList: filtered,
                });
            } else {
                wx.showModal({
                    title: '加载失败',
                    content: `HTTP ${res.data.status}`,
                    showCancel: false,
                });
            }
            wx.stopPullDownRefresh();
        } catch (e) {
            wx.stopPullDownRefresh();
            console.error(e);
        }
    },
    
});