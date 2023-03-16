const Material = require("./Material");

/**
 * @en UpgradeCost
 */
class UpgradeCost {

    /**
     * @param {number} coinCost
     * @param {Array<Object<string, any>>} costItems
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(coinCost, costItems, enka) {
        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {number} */
        this.coin = coinCost;

        /** @type {Array<{material: Material, count: number}>} */
        this.items = costItems.map(cost => {
            if (!cost.id) return null;
            return {
                material: Material.getMaterialById(cost.id),
                count: cost.count,
            };
        }).filter(cost => cost !== null);

    }
}

module.exports = UpgradeCost;