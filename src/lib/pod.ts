import { coreApi } from "../client/client";
import { PodLifeCycleStage } from "../common/constant";
import { ResourceUtilization, convertUnit } from "../utils/resource";

type PodStatusInfo = { phase: string | undefined, reason: string | undefined };

// get single pod
export const getPod = async (podName: string, namespace = "default") => {
    const { body } = await coreApi.listNamespacedPod(namespace, "true", undefined, undefined, `metadata.name=${podName}`, ``);
    if (body.items.length !== 0) return body.items[0];
}

export const getPodStatus = async (podName: string, namespace = "default"): Promise<PodStatusInfo> => {
    const podInfo = await getPod(podName, namespace);
    return { phase: podInfo?.status?.phase, reason: podInfo?.status?.reason };
}


export const getPodsToStatusMapping = async (appName: string, filterStatus: PodLifeCycleStage, namespace = "default") => {
    const pods = await getAllPodsForDeployment(appName, namespace);
    if (!pods) return;
    const podStatuses: Map<string, PodStatusInfo> = new Map<string, PodStatusInfo>();
    for (const pod of pods) {
        if (pod.metadata?.name && pod.status?.phase) {
            podStatuses.set(pod.metadata?.name, { phase: pod.status?.phase, reason: pod.status?.reason });
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
        if (!container.resources) continue;
        const { requests, limits } = container.resources;
        const cpuUtilizationOverLimit = (Number(convertUnit(requests?.cpu)) / Number(convertUnit(limits?.cpu))) * 100;
        const memoryUtilizationOverLimit = (Number(convertUnit(requests?.memory)) / Number(convertUnit(limits?.memory))) * 100;
        const utilization: ResourceUtilization = { name: container.name }
        if (!Number.isNaN(cpuUtilizationOverLimit)) {
            utilization.cpuUtilizationOverLimit = cpuUtilizationOverLimit;
        }
        if (!Number.isNaN(memoryUtilizationOverLimit)) {
            utilization.memoryUtilizationOverLimit = memoryUtilizationOverLimit;
        }
        containerUtilizationOverThreshold.push(utilization);

    }
    return containerUtilizationOverThreshold;
}