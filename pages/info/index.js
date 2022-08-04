
const app = getApp();

Page({

    data: {
        cabinetList: [],
        shopInfo: {},
        shopLongitude: 0,
        shopLatitude: 0,
        markers: [],
    },

    onLoad(query) {
        wx.showLoading({
            title: '加载中',
            mask: true,
        });
        this.setData({
            markers: [],
            cabinetList: [],
            shopInfo: {},
            shopLongitude: 0,
            shopLatitude: 0,
        });
        let request = wx.cloud.callContainer({
            config: {
                "env": "prod-0gmvmgprbb4448fb"
            },
            path: "/shop/info",
            header: {
              "X-WX-SERVICE": "miniapp-django"
            },
            method: "GET",
            data: {
                shop_id: query.id,
            },
        });
        let map = wx.createMapContext('info-map', this);
        request.then((res) => {
            if (res.data.status === 200) {
                wx.hideLoading();
                let loc = res.data.data.shopInfo.location.split(',');
                let lng = Number(loc[1]);
                let lat = Number(loc[0]);
                this.setData({
                    markers: [{
                        id: query.id,
                        latitude: loc[0],
                        longitude: loc[1],
                        iconPath: '../../static/map_marker.png',
                        width: 40,
                        height: 40,
                        callout: {
                            content: `${res.data.data.shopInfo.name}`,
                            borderRadius: 10,
                            fontSize: 14,
                            borderWidth: 1,
                            borderColor: '#000',
                            padding: 10,
                            display: 'ALWAYS',
                        },
                    }],
                    shopInfo: res.data.data.shopInfo,
                    cabinetList: res.data.data.cabinetList,
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
        }).catch((err) => {
            wx.hideLoading();
            wx.showModal({
                title: '加载失败',
                content: `云服务启动中，请稍后再进入小程序`,
                showCancel: false,
            });
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
