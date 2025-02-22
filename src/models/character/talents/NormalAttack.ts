import { JsonObject } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import UpgradableSkill from "./UpgradableSkill";

/**
 * @en NormalAttack
 * @extends {UpgradableSkill}
 */
class NormalAttack extends UpgradableSkill {
    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);
    }

    /**
     * @param id
     * @param enka
     */
    static getById(id: number, enka: EnkaClient): NormalAttack {
        return new NormalAttack(this._getJsonObjectById(id, enka), enka);
    }
}

export default NormalAttack;