export = CachedAssetsManager;
/**
 * @en CachedAssetsManager
 */
declare class CachedAssetsManager {
    /**
     * @param {import("./EnkaClient")} enka
     */
    constructor(enka: import("./EnkaClient"));
    /** @type {import("./EnkaClient")} */
    enka: import("./EnkaClient");
    /** @type {string} */
    defaultCacheDirectoryPath: string;
    /** @type {string} */
    cacheDirectoryPath: string;
    /** @type {number | null} */
    _cacheUpdater: number | null;
    /** @type {ConfigFile | null} */
    _githubCache: ConfigFile | null;
    /** @type {Array<string>} */
    _contentsSrc: Array<string>;
    /** @type {Array<string>} */
    _langs: Array<string>;
    /** @type {boolean} */
    _isFetching: boolean;
    /** @returns {Promise<void>} */
    cacheDirectorySetup(): Promise<void>;
    /**
     * @param {LanguageCode} lang
     * @param {boolean} [store=true]
     */
    fetchLanguageData(lang: LanguageCode, store?: boolean | undefined): Promise<any>;
    /**
     * Whether the game data update is available or not.
     * @param {boolean} [useRawGenshinData=false] Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/gamedata}) instead of downloading cache.zip
     * @returns {Promise<boolean>}
     */
    checkForUpdates(useRawGenshinData?: boolean | undefined): Promise<boolean>;
    /**
     * @param {Object<string, any>} options
     * @param {boolean} [options.useRawGenshinData=false] Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/gamedata}) instead of downloading cache.zip
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @returns {Promise<void>}
     */
    fetchAllContents(options: {
        [x: string]: any;
    }): Promise<void>;
    /**
     * @returns {boolean}
     */
    hasAllContents(): boolean;
    /**
     * Returns true if there were any updates, false if there were no updates.
     * @param {Object<string, any>} options
     * @param {boolean} [options.useRawGenshinData=false] Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/gamedata}) instead of downloading cache.zip
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    updateContents(options?: {
        [x: string]: any;
    }): Promise<boolean>;
    /**
     * @param {Object<string, any>} [options]
     * @param {boolean} [options.useRawGenshinData=false] Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/gamedata}) instead of downloading cache.zip
     * @param {boolean} [options.instant=true]
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @param {number} [options.timeout] in milliseconds
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @param {function(Error): Promise<*>} [options.onError]
     * @returns {void}
     */
    activateAutoCacheUpdater(options?: {
        [x: string]: any;
    } | undefined): void;
    /** @returns {void} */
    deactivateAutoCacheUpdater(): void;
    /**
     * @param {LanguageCode} lang
     * @returns {string}
     */
    getLanguageDataPath(lang: LanguageCode): string;
    /**
     * @param {string} name without extensions (.json)
     * @returns {string}
     */
    getJSONDataPath(name: string): string;
    /**
     * @param {string} name without extensions (.json)
     * @returns {object | any[]}
     */
    getGenshinCacheData(name: string): object | any[];
    /**
     * @param {LanguageCode} lang
     * @return {Object<string, any>}
     */
    getLanguageData(lang: LanguageCode): {
        [x: string]: any;
    };
    /** @returns {ObjectKeysManager} */
    getObjectKeysManager(): ObjectKeysManager;
    /**
     * Clean memory of cache data.
     * Then reload data that was loaded before the clean if `reload` is true.
     * If `reload` is false, load each file as needed.
     * @param {boolean} reload
     * @return {void}
     */
    refreshAllData(reload?: boolean): void;
    /**
     * Remove all unused TextHashMaps
     * @param {Object<string, any>} data {AvatarExcelConfigData: [Object object], ManualTextMapConfigData: [Object object], ...}
     * @param {Object<string, any>} langsData {en: [Object object], jp: [Object object], ...}
     * @param {boolean} [showLog=true]
     */
    removeUnusedTextData(data: {
        [x: string]: any;
    }, langsData: {
        [x: string]: any;
    }, showLog?: boolean | undefined): {};
    /**
     * @param {Object<string, any>} options
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @returns {Promise<void>}
     */
    _downloadCacheZip(options: {
        [x: string]: any;
    }): Promise<void>;
}
declare namespace CachedAssetsManager {
    export { LanguageCode };
}
import ConfigFile = require("../utils/ConfigFile");
type LanguageCode = "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi";
import ObjectKeysManager = require("./ObjectKeysManager");
