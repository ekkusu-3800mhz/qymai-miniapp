const QQMapWX = require("../libs/qqmap-wx-jssdk.js");
const { WX_CLOUD_CONF, QQ_MAP_CONF } = require("../app.config.js");

const callContainer = (path, method, data = null, extHeader = null) => {
    if (extHeader) {
        extHeader["X-WX-SERVICE"] = WX_CLOUD_CONF.SERVICE;
        header = extHeader;
    } else {
        header = {
            "X-WX-SERVICE": WX_CLOUD_CONF.SERVICE,
        };
    }
    return wx.cloud.callContainer({
        config: {
            "env": WX_CLOUD_CONF.ENV,
        },
        path,
        header,
        method,
        data,
    });
};

const callQQMap = () => {
    return new QQMapWX({
        key: QQ_MAP_CONF.KEY,
    });
};

const calculateDistance = (from, to) => {
    let map = callQQMap();
    return new Promise((resolve, reject) => {
        map.calculateDistance({
            mode: 'straight',
            from,
            to,
            success(res) {
                resolve(res.result.elements[0].distance);
            },
        });
    });
};

module.exports = {
    callContainer,
    callQQMap,
    calculateDistance,
};
