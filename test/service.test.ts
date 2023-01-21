/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, test, jest } from '@jest/globals';
import { V1ServiceList } from '@kubernetes/client-node';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

import data from "./testdata/serviceRespone.json";

import { getService, getServiceOfType } from '../src/lib/service';
import { coreApi } from '../src/client/client';




const okResponse = new IncomingMessage(new Socket());
const services: V1ServiceList = {
    items: [data]
}
const emptyServices: V1ServiceList = {
    items: []
}



async function MockedListNamespacedService(namespace: string, pretty?: string, allowWatchBookmarks?: boolean, _continue?: string, fieldSelector?: string, labelSelector?: string, limit?: number, resourceVersion?: string, resourceVersionMatch?: string, timeoutSeconds?: number, watch?: boolean, options?: {
    headers: {
        [name: string]: string;
    };
}) {
    return {
        body: services,
        response: okResponse
    }
}


async function MockedEmptyListNamespacedService(namespace: string, pretty?: string, allowWatchBookmarks?: boolean, _continue?: string, fieldSelector?: string, labelSelector?: string, limit?: number, resourceVersion?: string, resourceVersionMatch?: string, timeoutSeconds?: number, watch?: boolean, options?: {
    headers: {
        [name: string]: string;
    };
}) {
    return {
        body: emptyServices,
        response: okResponse
    }
}



describe("Service Test", () => {
    describe("Get Service Info", () => {

        test("Get Service Info full", async () => {
            coreApi.listNamespacedService = jest.fn(MockedListNamespacedService);
            const result = await getService("api-server");
            expect(result?.metadata?.name).toEqual("api-server");
            expect(result?.metadata?.namespace).toEqual("default");

        });

        test("Get Service Info Empty", async () => {
            coreApi.listNamespacedService = jest.fn(MockedEmptyListNamespacedService);
            const result = await getService("gg");
            expect(result).toBeUndefined();
        });

        test("Get Service of given type", async () => {
            coreApi.listNamespacedService = jest.fn(MockedListNamespacedService);
            let result = await getServiceOfType("LoadBalancer");
            if (!result) {
                result = [];
            }
            expect(result.length).toEqual(1);
            expect(result[0]?.metadata?.name).toEqual("api-server");
            expect(result[0]?.spec?.type).toEqual("LoadBalancer");
        });

        test("Get Service of given type invalid type", async () => {
            coreApi.listNamespacedService = jest.fn(MockedListNamespacedService);
            const result = await getServiceOfType("abc");
            expect(result).toBeUndefined();
        })

    });
})