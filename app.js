App({
    onLaunch() {
        wx.cloud.init();
        let location = wx.getLocation({type: 'gcj02'});
        location.then((res) => {
            this.globalData.userLocation = {
                longitude: res.longitude,
                latitude: res.latitude,
            };
        });
        let interval = setInterval(() => {
            let location = wx.getLocation({type: 'gcj02'});
            location.then((res) => {
                this.globalData.userLocation = {
                    longitude: res.longitude,
                    latitude: res.latitude,
                };
            });
        }, 30000);
    },

    globalData: {
        userLocation: {
            longitude: 0,
            latitude: 0,
        },
    },

})
