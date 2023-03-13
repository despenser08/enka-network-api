export = CharacterBuild;
/**
 * @en CharacterBuild
 */
declare class CharacterBuild {
    /**
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     * @param {string} username
     * @param {string} hash
     */
    constructor(data: {
        [x: string]: any;
    }, enka: EnkaClient, username: string, hash: string);
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {{username: string, hash: string}} */
    enkaUserInfo: {
        username: string;
        hash: string;
    };
    /** @type {number} */
    id: number;
    /** @type {string} */
    name: string;
    /** @type {number} */
    order: number;
    /** @type {boolean} */
    isLive: boolean;
    /** @type {boolean} */
    isPublic: boolean;
    /** @type {Character} */
    character: Character;
    /** @type {string} */
    url: string;
}
import EnkaClient = require("../../client/EnkaClient");
import Character = require("../character/Character");
