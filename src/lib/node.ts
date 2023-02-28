import { V1Node } from "@kubernetes/client-node";
import { coreApi } from "../client/client";
import { convertUnit } from "../utils/resource";

export const getNodes = async (nodeName: string) => {
    const node = await coreApi.listNode(undefined, false, undefined, `metadata.name=${nodeName}`);
    return node.body.items;
}

export const getNodesWithCpuCapcity = async (cpuCapacity: string) => {
    const nodeResponse = await coreApi.listNode();

    return nodeResponse.body.items.filter((node) => {
        if (cpuFilter(node, cpuCapacity)) return true;
        return false
    })
}


export const getNodesWithMemoryCapcity = async (memoryCapcity: string) => {
    const nodesResponse = await coreApi.listNode();

    return nodesResponse.body.items.filter((node) => {
        if (memoryFilter(node, memoryCapcity)) return true;
        return false
    });
}

export const getNodesWithResouceCapacity = async (memoryCapacity: string, cpuCapacity: string) => {
    const nodeResponse = await coreApi.listNode();

    return nodeResponse.body.items.filter((node) => {
        if (memoryFilter(node, memoryCapacity) && cpuFilter(node, cpuCapacity)) return true;
        return false;
    })

}



function cpuFilter(node: V1Node, cpuCapacity: string) {
    return node.status?.capacity?.cpu !== undefined && (Number(convertUnit(node.status?.capacity?.cpu)) >= Number(convertUnit(cpuCapacity)));
}

function memoryFilter(node: V1Node, memoryCapcity: string) {
    return node.status?.capacity?.memory !== undefined && (Number(convertUnit(node.status?.capacity?.memory)) >= Number(convertUnit(memoryCapcity)));
}

