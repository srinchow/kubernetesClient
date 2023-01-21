/* eslint-disable @typescript-eslint/no-unused-vars */
import { coreApi } from "../client/client";
import { serviceType } from "../common/constant";

export const getService = async (serviceName: string, namespace = "default") => {
    const { body } = await coreApi.listNamespacedService(namespace, "true", undefined, undefined, `metadata.name=${serviceName}`, '');
    if (body.items.length !== 0) return body.items[0];
}

export const getServiceOfType = async (type: string, namespace = "default") => {
    if (!serviceType.includes(type)) return;
    const { body } = await coreApi.listNamespacedService(namespace, "true", undefined, undefined, `spec.type=${type}`);
    return body.items;
}

export const getServiceLoadBalancer = async (serviceName: string, namespace = "default") => {
    const serviceInfo = await getService(serviceName, namespace);
    const ingresses = serviceInfo?.status?.loadBalancer?.ingress;
    if (!ingresses) return;
    const hostNames = [];
    for (const ingress of ingresses) {
        if (ingress.hostname) {
            hostNames.push(ingress.hostname);
        }
    }
    return hostNames
}