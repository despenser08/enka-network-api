import AssetsNotFoundError from "../errors/AssetsNotFoundError";
import TextAssets from "./assets/TextAssets";

/**
 * @en Element
 */
export default class Element {

    /**
     * @param {ElementType} id
     * @param {import("../client/EnkaClient")} enka
     */
    constructor(id, enka) {

        /** @type {ElementType} */
        this.id = id;

        /** @type {import("../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === id);
        if (!this._data) throw new AssetsNotFoundError("Element", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.textMapContentTextMapHash, enka);
    }
}

/**
 * @en ElementType
 * @typedef ElementType
 * @type {"Wind"|"Rock"|"Electric"|"Grass"|"Water"|"Fire"|"Ice"}
 * @example
 * |ElementType|In-game Name|
 * |---|---|
 * |Wind|Anemo|
 * |Rock|Geo|
 * |Electric|Electro|
 * |Grass|Dendro|
 * |Water|Hydro|
 * |Fire|Pyro|
 * |Ice|Cryo|
 */