export = CachedAssetsManager;
/**
 * @en CachedAssetsManager
 */
declare class CachedAssetsManager {
    /**
     * @param {EnkaClient} enka
     */
    constructor(enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
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
    /** @type {boolean} */
    _isFetching: boolean;
    /** @returns {Promise<void>} */
    cacheDirectorySetup(): Promise<void>;
    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang
     * @param {boolean} [store=true]
     */
    fetchLanguageData(lang: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi", store?: boolean): Promise<any>;
    /** @returns {Promise<void>} */
    fetchAllContents(): Promise<void>;
    /**
     * @returns {boolean}
     */
    hasAllContents(): boolean;
    /**
     * Returns true if there were any updates, false if there were no updates.
     * @param {object} options
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    updateContents(options?: {
        onUpdateStart?: () => Promise<any>;
        onUpdateEnd?: () => Promise<any>;
    }): Promise<boolean>;
    /**
     * @param {object} [options]
     * @param {boolean} [options.instant]
     * @param {number} [options.timeout] in milliseconds
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @param {function(Error): Promise<*>} [options.onError]
     * @returns {void}
     */
    activateAutoCacheUpdater(options?: {
        instant?: boolean;
        timeout?: number;
        onUpdateStart?: () => Promise<any>;
        onUpdateEnd?: () => Promise<any>;
        onError?: (arg0: Error) => Promise<any>;
    }): void;
    /** @returns {void} */
    deactivateAutoCacheUpdater(): void;
    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang
     * @returns {string}
     */
    getLanguageDataPath(lang: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi"): string;
    /**
     * @param {string} name without extensions (.json)
     * @returns {string}
     */
    getJSONDataPath(name: string): string;
    /**
     * Remove all unused TextHashMaps
     * @param {object} data {AvatarExcelConfigData: [Object object], ManualTextMapConfigData: [Object object], ...}
     * @param {object} langsData {en: [Object object], jp: [Object object], ...}
     */
    removeUnusedTextData(data: object, langsData: object): {};
}
import EnkaClient = require("./EnkaClient");
import ConfigFile = require("../utils/ConfigFile");
