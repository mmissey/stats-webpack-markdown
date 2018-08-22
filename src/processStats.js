'use strict';

const _ = require('lodash');
const assetsLoader = require('./assetsUtils/assetsLoader');
const assetStatsFormatter = require('./templates/assetStatsFormatter');
const templateFormatter = require('./templates/templateFormatter');
const fs = require('fs');
require('console.table');

const createAssetsStats = function (settings) {
    const assetStats = assetsLoader.getAssetsStats(settings.oldStats, settings.newStats)
        .filter(o => !settings.filterOnlyChanged || o.diff !== 0);

    if (assetStats.length === 0) return; // don't generate report when there are no assets.

    const sortedAssets = _.sortBy(assetStats, [(o) => { return Math.abs(o.pdiff); }]).reverse();
    const majorAssets = _.sortBy(
        assetStats.filter(o => Math.abs(o.pdiff) > settings.percentageThreshold),
        [(o) => { return Math.abs(o.pdiff); }])
        .reverse();

    const allAssetsTemplate = assetStatsFormatter.format(
        sortedAssets,
        settings.templates.assetsStats,
        ':mag_right:',
        ':white_check_mark:'
    );

    const majorAssetsTemplate = majorAssets.length > 0 ?
        assetStatsFormatter.format(
            majorAssets,
            settings.templates.majorChangedAssets,
            ':exclamation:', ':exclamation:',
            settings.majorChangesText
        ) :
        '';

    const headerTemplate = templateFormatter.format(settings.templates.header);
    const outFilePath = settings.outputPath;
    fs.writeFileSync(
        outFilePath,
        `${headerTemplate}${majorAssetsTemplate}${allAssetsTemplate}`
    );
    console.log('Major Bundle Changes');
    console.table(majorAssets);
    console.log(`Created report file in ${outFilePath}`);
};

module.exports = {
    createAssetsStats
};
