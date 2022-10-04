export = CharacterData;
declare class CharacterData {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {ImageAssets} */
    sideIcon: ImageAssets;
    /** @type {"QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP"} */
    qualityType: "QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP";
    /** @type {number} */
    stars: number;
    /** @type {Element} */
    element: Element;
    /** @type {Skill[]} */
    skills: Skill[];
    /** @type {Constellation[]} */
    constellations: Constellation[];
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
import Element = require("../Element");
import Skill = require("./Skill");
import Constellation = require("./Constellation");