/* eslint-disable @typescript-eslint/no-unused-vars */

import { describe, expect, test, jest } from '@jest/globals';
import { IncomingMessage } from 'http';
import { coreApi } from "../src/client/client";
import { Socket } from 'net';
import data from "./testdata/podResponse.json"
import { getPod, getPodStatus, getPodUsageOverLimitMetric } from "../src/lib/pod"
import { V1Pod, V1PodList } from '@kubernetes/client-node';

const podListResponse: V1PodList = {
    items: [data]
}

const podListEmptyResponse: V1PodList = {
    items: []
}

const podResponse: V1Pod = data;
const okResponse = new IncomingMessage(new Socket());
okResponse.statusCode = 200;

async function MockedListNamespacedPod(namespace: string, pretty?: string, allowWatchBookmarks?: boolean, _continue?: string, fieldSelector?: string, labelSelector?: string, limit?: number, resourceVersion?: string, resourceVersionMatch?: string, timeoutSeconds?: number, watch?: boolean, options?: {
    headers: {
        [name: string]: string;
    };
}) {
    return {
        body: podListResponse,
        response: okResponse
    }
}


async function MockedListEmptyNamespacedPod(namespace: string, pretty?: string, allowWatchBookmarks?: boolean, _continue?: string, fieldSelector?: string, labelSelector?: string, limit?: number, resourceVersion?: string, resourceVersionMatch?: string, timeoutSeconds?: number, watch?: boolean, options?: {
    headers: {
        [name: string]: string;
    };
}) {
    return {
        body: podListEmptyResponse,
        response: okResponse
    }
}

describe("Pod Test", () => {

    describe("Get Pod Info", () => {
        test("Get Pod Info Full", async () => {
            coreApi.listNamespacedPod = jest.fn(MockedListNamespacedPod);
            const result = await getPod("recorder-watcher");
            expect(result?.metadata?.name).toEqual("recorder-watcher-88cd749884-jxc5q");
            expect(result?.status?.phase).toEqual("Running");
            expect(result?.spec?.containers && result?.spec?.containers[0].image).toEqual("test/recorder-watcher:acf3e8cbe");
        })

        test("Get Pod Info Empty", async () => {
            coreApi.listNamespacedPod = jest.fn(MockedListEmptyNamespacedPod);
            const result1 = await getPod("gg");
            expect(result1).toBeUndefined();
        })

        test("Get Pod Status", async () => {
            coreApi.listNamespacedPod = jest.fn(MockedListNamespacedPod);
            const result = await getPodStatus("recorder-watcher");
            expect(result?.phase).toBe("Running");
            expect(result?.reason).toBeUndefined();
        })

        test("Get Pod Status Empty", async () => {
            coreApi.listNamespacedPod = jest.fn(MockedListEmptyNamespacedPod);
            const result = await getPodStatus("gg");
            expect(result?.phase).toBeUndefined();
            expect(result?.reason).toBeUndefined();
        })

    })


    test("Get Pod Utilization Metric", async () => {
        coreApi.listNamespacedPod = jest.fn(MockedListNamespacedPod)
        const result = await getPodUsageOverLimitMetric("recorder-watcher")
        expect(result.length).toEqual(1)
        expect(result[0].cpuUtilizationOverLimit).toEqual(40)
        expect(result[0].memoryUtilizationOverLimit).toEqual(30)
    })
})
