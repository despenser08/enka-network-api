import { JsonReader, JsonObject, renameKeys } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import User from "../User";
import GenshinCharacterBuild from "./GenshinCharacterBuild";

/** @typedef */
export type GameServerRegion = "" | "CN" | "B" | "NA" | "EU" | "ASIA" | "TW";

/**
 * The game account added to the Enka.Network account.
 * @en EnkaUser
 */
class EnkaUser {
    /**  */
    readonly enka: EnkaClient;
    /** Enka.Network username, not in-game nickname */
    readonly username: string;
    /**  */
    readonly hash: string;
    /**  */
    readonly user: User;
    /**  */
    readonly uid: number | null;
    /**  */
    readonly isVerified: boolean;
    /**  */
    readonly isPublic: boolean;
    /**  */
    readonly isUidPublic: boolean;
    /**  */
    readonly verificationCode: string | null;
    /**  */
    readonly verificationExpires: Date | null;
    /**  */
    readonly verificationCodeRetries: number | null;
    /**
     * The region of the server where the account was created
     * https://cdn.discordapp.com/attachments/971472744820650035/1072868537472925767/image.png
     */
    readonly region: GameServerRegion;
    /**  */
    readonly order: number;
    /**  */
    readonly url: string;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     * @param username
     */
    constructor(data: JsonObject, enka: EnkaClient, username: string) {

        this._data = data;

        this.enka = enka;

        this.username = username;

        const json = new JsonReader(this._data);

        this.hash = json.getAsString("hash");

        const fixedData = renameKeys(data, { "player_info": "playerInfo" });

        this.user = new User(fixedData, enka);

        this.uid = json.getAsNumberWithDefault(null, "uid");

        this.isVerified = json.getAsBoolean("verified");

        this.isPublic = json.getAsBoolean("public");

        this.isUidPublic = json.getAsBoolean("uid_public");

        this.verificationCode = json.getAsStringWithDefault(null, "verification_code");

        this.verificationExpires = json.has("verification_expire") ? new Date(json.getAsNumber("verification_expire")) : null;

        this.verificationCodeRetries = json.getAsNumberWithDefault(null, "verification_code_retries");

        this.region = json.getAsString("region") as GameServerRegion;

        this.order = json.getAsNumber("order") as number;

        this.url = `${enka.options.enkaUrl}/u/${username}/${this.hash}`;
    }

    /**
     * @returns the character builds including saved builds in Enka.Network account
     */
    async fetchBuilds(): Promise<{ [characterId: string]: (GenshinCharacterBuild | unknown)[] }> {
        return await this.enka.fetchEnkaUserBuilds(this.username, this.hash);
    }

    /**
     * @returns the genshin character builds including saved builds in Enka.Network account
     */
    async fetchGenshinBuilds(): Promise<{ [characterId: string]: GenshinCharacterBuild[] }> {
        return await this.enka.fetchEnkaUserGenshinBuilds(this.username, this.hash);
    }

    /**
     * This requires [enka](#enka) with `starrailClient`.
     * And the `starrailClient` option in [EnkaClientOptions](EnkaClientOptions) must be
     * an instance of StarRail from [starrail.js](https://github.com/yuko1101/starrail.js).
     * @returns the starrail character builds including saved builds in Enka.Network account
     */
    async fetchStarRailBuilds(): Promise<{ [characterId: string]: unknown[] }> {
        return await this.enka.fetchEnkaUserStarRailBuilds(this.username, this.hash);
    }
}

export default EnkaUser;