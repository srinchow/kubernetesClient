import { appApi, coreApi } from "../client/client";


export const getNodes = async (nodeName: string, namespaced = "default") => {
    const node = await coreApi.listNode(undefined, false, undefined, `metadata.name=${nodeName}`);
    return node.body.items;
}


