const EnkaClient = require("./EnkaClient");
const fs = require("fs");
const path = require("path");
const ConfigFile = require("../utils/ConfigFile");
const { bindOptions } = require("../utils/options_utils");
const { fetchJSON } = require("../utils/axios_utils");
const { move } = require("../utils/file_utils");

const languages = ["chs", "cht", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"];


// Thanks @Dimbreath
const contentBaseUrl = "https://gitlab.com/Dimbreath/gamedata/-/raw/main";
const contents = [
    "AvatarExcelConfigData", // Characters
    "AvatarCostumeExcelConfigData", // Costumes
    "AvatarSkillDepotExcelConfigData", // Skill Depot
    "AvatarSkillExcelConfigData", // Skills
    "AvatarTalentExcelConfigData", // Constellations
    "ReliquaryExcelConfigData", // Artifacts
    "WeaponExcelConfigData", // Weapons
    "EquipAffixExcelConfigData", // Artifact Sets
    "ManualTextMapConfigData", // Fight Props
    "MaterialExcelConfigData", // Materials (including NameCards)
    "ProudSkillExcelConfigData", // Passive Talents
    "ReliquaryAffixExcelConfigData", // Artifact Affix
    "AvatarCodexExcelConfigData", // Character Release Information
    "AvatarHeroEntityExcelConfigData", // Travelers
];

const manualTextMapWhiteList = [
    "EquipType",
    "EQUIP_BRACER",
    "EQUIP_DRESS",
    "EQUIP_SHOES",
    "EQUIP_RING",
    "EQUIP_NECKLACE",
    "ElementType",
    "None",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Wind",
    "Ice",
    "Rock",
    "WeaponType",
]

/** 
 * @en CachedAssetsManager
 */
class CachedAssetsManager {

    /**
     * @param {EnkaClient} enka 
     */
    constructor(enka) {
        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {string} */
        this.defaultCacheDirectoryPath = path.resolve(__dirname, "..", "..", "cache");

        /** @type {string} */
        this.cacheDirectoryPath = enka.options.cacheDirectory ?? this.defaultCacheDirectoryPath;

        /** @type {number | null} */
        this._cacheUpdater = null;

        /** @type {ConfigFile | null} */
        this._githubCache = null;

        /** @type {boolean} */
        this._isFetching = false;
    }

    /** @returns {Promise<void>} */
    async cacheDirectorySetup() {
        if (!fs.existsSync(this.cacheDirectoryPath)) {
            fs.mkdirSync(this.cacheDirectoryPath);

            const defaultCacheFiles = fs.readdirSync(this.defaultCacheDirectoryPath);
            if (defaultCacheFiles.length > 0) {
                try {
                    move(this.defaultCacheDirectoryPath, this.cacheDirectoryPath);
                } catch (e) {
                    console.error(`Auto-Moving cache data failed with error: ${e}`);
                }
            }
        }
        if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "data"))) {
            fs.mkdirSync(path.resolve(this.cacheDirectoryPath, "data"));
        }
        if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "langs"))) {
            fs.mkdirSync(path.resolve(this.cacheDirectoryPath, "langs"));
        }
        if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "github"))) {
            fs.mkdirSync(path.resolve(this.cacheDirectoryPath, "github"));
        }

        const githubCachePath = path.resolve(this.cacheDirectoryPath, "github", "genshin_data.json");
        if (!fs.existsSync(githubCachePath) || !this._githubCache) {
            this._githubCache = await new ConfigFile(githubCachePath, {
                "lastUpdate": 0,
            }).load();
        }
    }


    /** 
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang 
     * @param {boolean} [store=true]
     */
    async fetchLanguageData(lang, store = true) {
        await this.cacheDirectorySetup();
        const url = `${contentBaseUrl}/TextMap/TextMap${lang.toUpperCase()}.json`;
        const json = (await fetchJSON(url, this.enka)).data;
        if (store) fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`), JSON.stringify(json));
        return json;
    }


    /** @returns {Promise<void>} */
    async fetchAllContents() {
        await this.cacheDirectorySetup();

        this._isFetching = true;

        const promises = [];
        const genshinData = {};
        for (const content of contents) {
            const fileName = `${content}.json`;
            const url = `${contentBaseUrl}/ExcelBinOutput/${fileName}`;
            promises.push((async () => {
                const json = (await fetchJSON(url, this.enka)).data;
                fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "data", fileName), JSON.stringify(json));
                genshinData[content] = json;
            })());
        }
        await Promise.all(promises);

        fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "genshinData.json"), JSON.stringify(genshinData));

        const langsData = {};

        const langPromises = [];
        for (const lang of languages) {
            langPromises.push(
                (async () => {
                    const data = await this.fetchLanguageData(lang, false);
                    langsData[lang] = data;
                })()
            );
        }
        await Promise.all(langPromises);

        fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langData.json"), JSON.stringify(langsData));

        const clearLangsData = this.removeUnusedTextData(genshinData, langsData);
        fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "clearLangData.json"), JSON.stringify(clearLangsData));
        for (const lang of Object.keys(clearLangsData)) {
            fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`), JSON.stringify(clearLangsData[lang]));
        }

        await this._githubCache.set("lastUpdate", Date.now()).save();
        this._isFetching = false;
    }

    /**
     * @returns {boolean}
     */
    hasAllContents() {
        for (const lang of languages) {
            if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`))) return false;
        }
        for (const content of contents) {
            const fileName = `${content}.json`;
            if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "data", fileName))) return false;
        }
        return true;
    }

    /**
     * Returns true if there were any updates, false if there were no updates.
     * @param {object} options
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    async updateContents(options = {}) {
        options = bindOptions({
            onUpdateStart: null,
            onUpdateEnd: null,
        }, options);

        await this.cacheDirectorySetup();

        const res = await fetchJSON(`https://gitlab.com/api/v4/projects/41287973/repository/commits?since=${new Date(this._githubCache.getValue("lastUpdate")).toISOString()}`, this.enka);
        if (res.status !== 200) {
            throw new Error("Request Failed");
        }

        const data = res.data;

        if (data.length !== 0) {
            await options.onUpdateStart?.();
            // fetch all because large file diff cannot be retrieved
            await this.fetchAllContents();
            await options.onUpdateEnd?.();
        }
    }

    /** 
     * @param {object} [options]
     * @param {boolean} [options.instant]
     * @param {number} [options.timeout] in milliseconds
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @param {function(Error): Promise<*>} [options.onError]
     * @returns {void}
     */
    activateAutoCacheUpdater(options = {}) {
        options = bindOptions({
            instant: true,
            timeout: 60 * 60 * 1000,
            onUpdateStart: null,
            onUpdateEnd: null,
            onError: null,
        }, options);
        if (options.timeout < 60 * 1000) throw new Error("timeout cannot be shorter than 1 minute.");
        if (options.instant) this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd });
        this._cacheUpdater = setInterval(async () => {
            if (this._isFetching) return;
            try {
                this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd });
            } catch (e) {
                options.onError?.(e);
            }
        }, options.timeout);
    }

    /** @returns {void} */
    deactivateAutoCacheUpdater() {
        if (this._cacheUpdater !== null) {
            clearInterval(this._cacheUpdater);
            this._cacheUpdater = null;
        }
    }

    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang 
     * @returns {string}
     */
    getLanguageDataPath(lang) {
        return path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`);
    }

    /**
     * @param {string} name without extensions (.json)
     * @returns {string}
     */
    getJSONDataPath(name) {
        return path.resolve(this.cacheDirectoryPath, "data", `${name}.json`);
    }


    /**
     * Remove all unused TextHashMaps
     * @param {object} data {AvatarExcelConfigData: [Object object], ManualTextMapConfigData: [Object object], ...}
     * @param {object} langsData {en: [Object object], jp: [Object object], ...}
     */
    removeUnusedTextData(data, langsData) {
        const required = [];
        data["AvatarExcelConfigData"].forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        data["ManualTextMapConfigData"].forEach(m => {
            const id = m.textMapId;
            if (!manualTextMapWhiteList.includes(id) && !id.startsWith("FIGHT_REACTION_") && !id.startsWith("FIGHT_PROP_") && !id.startsWith("PROP_") && !id.startsWith("WEAPON_")) return;
            required.push(m.textMapContentTextMapHash);
        });
        data["ReliquaryExcelConfigData"].forEach(a => {
            required.push(a.nameTextMapHash, a.descTextMapHash)
        });
        data["EquipAffixExcelConfigData"].forEach(s => {
            required.push(s.nameTextMapHash, s.descTextMapHash);
        });
        data["AvatarTalentExcelConfigData"].forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        data["AvatarCostumeExcelConfigData"].forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        data["ProudSkillExcelConfigData"].forEach(p => {
            required.push(p.nameTextMapHash, p.descTextMapHash);
        });
        data["AvatarSkillExcelConfigData"].forEach(s => {
            required.push(s.nameTextMapHash, s.descTextMapHash);
        });
        data["WeaponExcelConfigData"].forEach(w => {
            required.push(w.nameTextMapHash, w.descTextMapHash);
        });
        data["EquipAffixExcelConfigData"].forEach(r => {
            required.push(r.nameTextMapHash, r.descTextMapHash);
        });
        data["MaterialExcelConfigData"].forEach(m => {
            required.push(m.nameTextMapHash, m.descTextMapHash);
        });

        const requiredStringKeys = required.map(key => key.toString());

        const clearLangsData = {};

        for (const lang of Object.keys(langsData)) {
            const langData = { ...langsData[lang] };
            for (const key of Object.keys(langData)) {
                if (!requiredStringKeys.includes(key)) delete langData[key];
            }
            console.log(Object.keys(langData).length + " keys in " + lang);
            clearLangsData[lang] = langData;
            console.log(Object.keys(clearLangsData).length + " langs");
        };

        return clearLangsData;
    }
}

module.exports = CachedAssetsManager;