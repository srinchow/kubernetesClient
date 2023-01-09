import { coreApi } from "../client/client";

interface ResourceUtilization { name: string, cpuUtilizationOverLimit?: number, memoryUtilizationOverLimit?: number }

// get single pod
export const getPod = async (podName: string, namespace = "default") => {
    const { body } = await coreApi.listNamespacedPod(namespace, "true", undefined, undefined, `metadata.name=${podName}`, ``);
    if (body.items.length !== 0) return body.items[0];
}

export const getPodStatus = async (podName: string, namespace = "default") => {
    const podInfo = await getPod(podName, namespace);
    return podInfo?.status?.phase;
}


export const getPodsToStatusMapping = async (appName: string, namespace = "default") => {
    const pods = await getAllPodsForDeployment(appName, namespace);
    if (!pods) return;
    const podStatuses: Map<string, string> = new Map<string, string>();
    for (const pod of pods) {
        if (pod.metadata?.name && pod.status?.phase) {
            podStatuses.set(pod.metadata?.name, pod.status?.phase);
        }
    }
    return podStatuses;
}

export const getAllPodsForDeployment = async (appName: string, namespace = "default") => {
    const { body } = await coreApi.listNamespacedPod(namespace, "true", undefined, undefined, '', `app=${appName}`);
    return body.items;
}

export const getPodContainerImages = async (podName: string, namespace = "default") => {
    const podInfo = await getPod(podName, namespace);
    const containers = podInfo?.spec?.containers;
    if (!containers) return;
    const containerNameToImage = new Map<string, string>();
    for (const container of containers) {
        if (container.image) {
            containerNameToImage.set(container.name, container.image);
        }
    }
    return containerNameToImage;
}

export const getPodUsageOverLimitMetric = async (podName: string, namespace = "default") => {
    const podInfo = await getPod(podName, namespace);
    const containers = podInfo?.spec?.containers;
    if (!containers) return [];

    const containerUtilizationOverThreshold: ResourceUtilization[] = [];

    for (const container of containers) {
        if (!container.resources) continue
        const { requests, limits } = container.resources;
        const cpuUtilizationOverLimit = (Number(requests?.cpu) / Number((limits?.cpu))) * 100
        const memoryUtilizationOverLimit = (Number(requests?.memory) / Number(limits?.memory)) * 100
        const utilization: ResourceUtilization = { name: container.name }
        if (!Number.isNaN(cpuUtilizationOverLimit)) {
            utilization.cpuUtilizationOverLimit = cpuUtilizationOverLimit
        }
        if (!Number.isNaN(memoryUtilizationOverLimit)) {
            utilization.memoryUtilizationOverLimit = memoryUtilizationOverLimit
        }
        containerUtilizationOverThreshold.push(utilization)

    }
    return containerUtilizationOverThreshold
}
