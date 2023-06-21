import { JsonReader, JsonObject } from "config_file.js";
import CharacterData from "./character/CharacterData";
import Costume from "./character/Costume";
import EnkaProfile from "./enka/EnkaProfile";
import Material, { NameCard } from "./material/Material";
import EnkaClient from "../client/EnkaClient";

/** @typedef */
export interface CharacterPreview {
    characterData: CharacterData;
    level: number;
    costume: Costume;
}

/**
 * @en User
 */
class User {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly uid: number;
    /**  */
    readonly nickname: string | null;
    /**  */
    readonly signature: string | null;
    /**  */
    readonly profilePictureCharacter: CharacterData | null;
    /**  */
    readonly charactersPreview: CharacterPreview[];
    /**  */
    readonly nameCards: NameCard[];
    /**  */
    readonly level: number;
    /**  */
    readonly worldLevel: number;
    /**  */
    readonly profileCard: NameCard;
    /**  */
    readonly achievements: number;
    /**  */
    readonly spiralAbyss: {
        floor: number,
        chamber: number,
    } | null;

    /** This will be -1 if this User is from EnkaUser */
    readonly ttl: number;
    /**  */
    readonly enkaProfile: EnkaProfile | null;
    /**  */
    readonly enkaUserHash: string | null;
    /**  */
    readonly url: string;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
    */
    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;

        this._data = data;

        if (!enka.cachedAssetsManager.hasAllContents()) throw new Error("Complete Genshin data cache not found.\nYou need to fetch Genshin data by EnkaClient#cachedAssetsManager#fetchAllContents.");

        const json = new JsonReader(this._data);

        this.uid = Number(json.getValue("uid"));

        const playerInfo = json.get("playerInfo");

        this.nickname = playerInfo.getAsStringWithDefault(null, "nickname");

        this.signature = playerInfo.getAsStringWithDefault(null, "signature");

        const profilePicture = playerInfo.get("profilePicture");
        this.profilePictureCharacter = profilePicture.has("avatarId") ? CharacterData.getById(profilePicture.getAsNumber("avatarId"), enka) : null;

        this.charactersPreview = playerInfo.has("showAvatarInfoList") ? playerInfo.get("showAvatarInfoList").mapArray((_, p) => {
            const characterData = CharacterData.getById(p.getAsNumber("avatarId"), enka);

            const costume = p.has("costumeId") ? Costume.getById(p.getAsNumber("costumeId"), enka) : (characterData.costumes.find(c => c.isDefault) as Costume);

            const preview: CharacterPreview = {
                characterData,
                level: p.getAsNumber("level"),
                costume,
            };

            return preview;
        }) : [];

        this.nameCards = playerInfo.has("showNameCardIdList") ? playerInfo.get("showNameCardIdList").mapArray((_, id) => Material.getMaterialById(id.getAsNumber(), enka) as NameCard) : [];

        this.level = playerInfo.getAsNumber("level");

        this.worldLevel = playerInfo.getAsNumberWithDefault(0, "worldLevel");

        this.profileCard = Material.getMaterialById(playerInfo.getAsNumber("nameCardId"), enka) as NameCard;

        this.achievements = playerInfo.getAsNumberWithDefault(0, "finishAchievementNum");

        this.spiralAbyss = playerInfo.has("towerFloorIndex") && playerInfo.has("towerLevelIndex") ? { floor: playerInfo.getAsNumber("towerFloorIndex"), chamber: playerInfo.getAsNumber("towerLevelIndex") } : null;

        this.ttl = json.getAsNumberWithDefault(-1, "ttl");

        this.enkaProfile = json.has("owner") ? new EnkaProfile(json.getAsJsonObject("owner"), enka) : null;

        this.enkaUserHash = json.getAsStringWithDefault(null, "owner", "hash");

        this.url = `${enka.options.enkaUrl}/u/${this.uid}`;
    }
}

export default User;