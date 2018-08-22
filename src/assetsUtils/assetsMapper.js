'use strict';

const _ = require('lodash');

const map = function(stats) {
    return stats.assets.reduce((acc, current) => {
        const chunkName = _.head(current.chunkNames);
        const extention = current.name.split('.').pop();
        const name = chunkName ? `${chunkName}.${extention}` : current.name.split('.')[0];
        acc[name] = current.size;
        return acc;
    }, {});
};

const mapStatsComparison = function (oldAssetSize, newAssetSize) {
    const oldSize = (oldAssetSize ? oldAssetSize : 0) / 1024;
    const newSize = (newAssetSize ? newAssetSize : 0) / 1024;
    const sizeDiff = newSize - oldSize;
    const sizePDiff = oldSize === 0 ? 100 : (1 - newSize / oldSize) * -100;
    return {
        oldSize: (oldSize),
        newSize: (newSize),
        diff: sizeDiff,
        pdiff: sizeDiff === 0 ? 0 : sizePDiff,
    };
};

module.exports = {
    map,
    mapStatsComparison
};
