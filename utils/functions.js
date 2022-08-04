const WX_CLOUD_CONF = {
    ENV: "",
    SERVICE: "",
};

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
}

module.exports = {
    callContainer,
};
