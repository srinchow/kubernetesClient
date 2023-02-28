/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, test, jest } from '@jest/globals';
import { V1NodeList } from '@kubernetes/client-node';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import data from "./testdata/nodeResponse.json";
import { coreApi } from '../src/client/client';
import { getNode } from '../src/lib/node'


const okResponse = new IncomingMessage(new Socket());
const nodes: V1NodeList = {
    items: [data]
}
const emptyNodes: V1NodeList = {
    items: []
}



async function MockedListNamespacedNode(pretty?: string, allowWatchBookmarks?: boolean, _continue?: string, fieldSelector?: string, labelSelector?: string, limit?: number, resourceVersion?: string, resourceVersionMatch?: string, timeoutSeconds?: number, watch?: boolean, options?: {
    headers: {
        [name: string]: string;
    };
}) {
    return {
        body: nodes,
        response: okResponse
    }
}


async function MockedEmptyListNamespacedNode(pretty?: string, allowWatchBookmarks?: boolean, _continue?: string, fieldSelector?: string, labelSelector?: string, limit?: number, resourceVersion?: string, resourceVersionMatch?: string, timeoutSeconds?: number, watch?: boolean, options?: {
    headers: {
        [name: string]: string;
    };
}) {
    return {
        body: emptyNodes,
        response: okResponse
    }
}

describe("Node Test", () => {

    describe("Get Node info", () => {
        test("Get Node", async () => {
            coreApi.listNode = jest.fn(MockedListNamespacedNode);

            const res = await getNode("ip-10-0-21-230.ec2.internal");
            expect(res.length).toBeGreaterThanOrEqual(1);
            expect(res[0].metadata?.name).toBe("ip-10-0-21-230.ec2.internal");

        });

        test("Get Node Empty", async () => {
            coreApi.listNode = jest.fn(MockedEmptyListNamespacedNode);
            const res = await getNode("gg");
            expect(res.length).toBe(0);
        });
    })
})
