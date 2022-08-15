const { callContainer } = require("../../utils/functions.js");

const app = getApp();

Page({

    data: {
        cabinetInfo: {},
        playerCount: 0,
        errorMessage: "",
    },

    async onLoad(query) {
        wx.showLoading({
            title: '加载中',
            mask: true,
        });
        this.setData({
            cabinetInfo: {},
            playerCount: 0,
        });
        try {
            let res = await callContainer("/queue/info", "GET", {cabinet_id: query.id});
            if (res.data.status === 200) {
                this.setData({
                    cabinetInfo: res.data.data.cabinetInfo,
                });
            } else {
                wx.showModal({
                    title: '加载失败',
                    content: `HTTP ${res.data.status}`,
                    showCancel: false,
                });
            }
            wx.hideLoading();
        } catch (e) {
            wx.hideLoading();
            wx.showModal({
                title: '加载失败',
                content: `云服务启动中，请稍后再进入小程序`,
                showCancel: false,
            });
        }
    },

    playerCountChange(e) {
        this.setData({
            errorMessage: "",
        });
        if (e.detail != "" && /^\d+$/.test(e.detail)) {
            let count = 0;
            if (e.detail > 0) {
                count = e.detail;
            }
            this.setData({
                playerCount: count,
            });
        } else {
            this.setData({
                errorMessage: "请正确输入当前排队人数",
            });
        }
    },

    async playerCountUpdate() {
        wx.showLoading({
            title: '加载中',
            mask: true,
        });
        try {
            let data = {
                cabinet_id: this.data.cabinetInfo.id,
                player_count: this.data.playerCount,
            };
            let header = {
                'content-type': 'application/x-www-form-urlencoded',
            };
            let res = await callContainer("/queue/update", "POST", data, header);
            if (res.data.status === 200) {
                wx.showToast({
                    title: "更新成功",
                    icon: "success",
                });
                setTimeout(() => {
                    wx.hideToast();
                    wx.redirectTo({
                        url: '/pages/queue/index',
                    });
                }, 1000);
            } else {
                wx.showModal({
                    title: '加载失败',
                    content: `HTTP ${res.data.status}`,
                    showCancel: false,
                });
            }
            wx.hideLoading();
        } catch (e) {
            wx.hideLoading();
            wx.showModal({
                title: '加载失败',
                content: `云服务启动中，请稍后再进入小程序`,
                showCancel: false,
            });
        }
    },
    
});