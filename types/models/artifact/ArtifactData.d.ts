export = ArtifactData;
/**
 * @en ArtifactData
 */
declare class ArtifactData {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [setData]
     */
    constructor(id: number, enka: import("../../client/EnkaClient"), setData?: {
        [x: string]: any;
    } | undefined);
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {number} */
    id: number;
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {"EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS" } Flower of Life, Plume of Death, Sands of Eon, Goblet of Eonothem, Circlet of Logos */
    equipType: "EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS";
    /** @type {Object<string, any>} */
    _equipTypeData: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    equipTypeName: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {number} */
    stars: number;
    /** @type {ArtifactSet} */
    set: ArtifactSet;
}
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
import ArtifactSet = require("./ArtifactSet");
