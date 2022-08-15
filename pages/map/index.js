const { callContainer } = require("../../utils/functions.js");

const app = getApp();

Page({

    data: {
        markers: [],
        actionSheetShow: false,
        shopInfo: {},
        shopLongitude: 0,
        shopLatitude: 0,
        centerLongitude: 113.031524,
        centerLatitude: 23.70992,
    },

    async onLoad() {
        wx.showLoading({
            title: '加载店铺中',
            mask: true,
        });
        this.setData({markers: []});
        let map = wx.createMapContext('map', this);
        try {
            let res = await callContainer("/shop/list", "GET");
            if (res.data.status === 200) {
                let shopList = res.data.data.shopList;
                let markers = [];
                shopList.forEach((s) => {
                    let loc = s.location.split(',');
                    markers.push({
                        id: s.id,
                        latitude: loc[0],
                        longitude: loc[1],
                        iconPath: '../../static/map_marker.png',
                        width: 40,
                        height: 40,
                        callout: {
                            content: `${s.name}\n（点击气泡获取详细信息）`,
                            borderRadius: 10,
                            fontSize: 14,
                            borderWidth: 1,
                            borderColor: '#000',
                            padding: 10,
                        },
                    });
                });
                    this.setData({
                        markers: markers,
                    });
                    wx.hideLoading();
            } else {
                wx.hideLoading();
                wx.showModal({
                    title: '加载失败',
                    content: `HTTP ${res.data.status}`,
                    showCancel: false,
                });
            } 
        } catch (err) {
            wx.hideLoading();
            wx.showModal({
                title: '加载失败',
                content: `云服务启动中，请稍后再进入小程序`,
                showCancel: false,
            });
        };
    },

    async calloutTap(e) {
        wx.showLoading({
            title: '加载店铺中',
            mask: true,
        });
        let shopId = e.detail.markerId;
        this.setData({
            actionSheetShow: false,
            shopInfo: {},
        });
        try {
            let res = await callContainer("/shop/info", "GET", {shop_id: shopId});
            if (res.data.status === 200) {
                wx.hideLoading();
                let loc = res.data.data.shopInfo.location.split(',');
                let lng = Number(loc[1]);
                let lat = Number(loc[0]);
                this.setData({
                    actionSheetShow: true,
                    shopInfo: res.data.data.shopInfo,
                    shopLongitude: lng,
                    shopLatitude: lat,
                });
            } else {
                wx.hideLoading();
                wx.showModal({
                    title: '加载失败',
                    content: `HTTP ${res.data.status}`,
                    showCancel: false,
                });
            }
        } catch (err) {
            wx.hideLoading();
            wx.showModal({
                title: '加载失败',
                content: `云服务启动中，请稍后再进入小程序`,
                showCancel: false,
            });
        };
    },

    actionSheetClose() {
        this.setData({
            actionSheetShow: false,
        });
    },

    toLocation() {
        this.setData({
            centerLongitude: app.globalData.userLocation.longitude,
            centerLatitude: app.globalData.userLocation.latitude,
        });
    },

    toShopInfo() {
        let shopId = this.data.shopInfo.id;
        wx.navigateTo({
            url: `/pages/info/index?id=${shopId}`,
        });
    },

    setNavi() {
        wx.openLocation({
            latitude: this.data.shopLatitude,
            longitude: this.data.shopLongitude,
            name: this.data.shopInfo.name,
            address: this.data.shopInfo.address,
            scale: 15,
        });
    },

});
