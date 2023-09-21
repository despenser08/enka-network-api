import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import EnkaClient from "../client/EnkaClient";
import { JsonObject } from "config_file.js";

/**
 * @param url
 * @param enka
 * @param enableTimeout
 */
export async function fetchJSON(url: string, enka: EnkaClient, enableTimeout = false): Promise<AxiosResponse> {
    const headers: JsonObject = { "User-Agent": enka.options.userAgent };
    if (enka.options.githubToken && url.startsWith("https://api.github.com/")) headers["Authorization"] = `Bearer ${enka.options.githubToken}`;

    const options: AxiosRequestConfig = { headers } as AxiosRequestConfig;
    if (enableTimeout) options.timeout = enka.options.requestTimeout;

    const res = await axios.get(url, options);

    try {
        res.data = JSON.parse(res.data);
    } catch (e) {
        // do not parse if it is not json due to some error
    }

    return res;
}
