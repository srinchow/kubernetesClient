/* eslint-disable @typescript-eslint/no-unused-vars */

import { describe, expect, test, jest } from '@jest/globals';
import { IncomingMessage } from 'http';
import { appApi } from "../src/client/client";
import { V1Deployment, V1DeploymentList } from "@kubernetes/client-node";
import { Socket } from 'net';
import data from "./testdata/deploymentResponse.json"
import { getDeploymentsInfo, restartDeployment, scaleDeployment } from "../src/lib/deployment"

const emptyDeployment = new V1Deployment();

const deploymentList: V1DeploymentList = {
    items: [data]
};
const emptyDeploymentList: V1DeploymentList = {
    items: []
};
const okResponse = new IncomingMessage(new Socket());
okResponse.statusCode = 200;


async function MockedlistNamespacedDeploymentFull(_namespace: string, _pretty?: string, _allowWatchBookmarks?: boolean, _continue?: string, _fieldSelector?: string, _labelSelector?: string, _limit?: number, _resourceVersion?: string, _resourceVersionMatch?: string, _timeoutSeconds?: number, _watch?: boolean, _options?: { headers: { [name: string]: string } }) {
    return {
        body: deploymentList,
        response: okResponse
    }
}

async function MockedlistNamespacedDeploymentEmpty(_namespace: string, _pretty?: string, _allowWatchBookmarks?: boolean, _continue?: string, _fieldSelector?: string, _labelSelector?: string, _limit?: number, _resourceVersion?: string, _resourceVersionMatch?: string, _timeoutSeconds?: number, _watch?: boolean, _options?: { headers: { [name: string]: string } }) {
    return {
        body: emptyDeploymentList,
        response: okResponse
    }
}


async function MockedPatchNamespacedDeployment(_name: string, _namespace: string, _body: object, _pretty?: string, _dryRun?: string, _fieldManager?: string, _force?: boolean, _options?: { headers: { [name: string]: string } }) {
    return {
        body: data,
        response: okResponse
    }
}

async function MockedReadNamespaceDeployment(_name: string, _namespace: string, _pretty?: string, _options?: { headers: { [name: string]: string } }) {
    return {
        body: emptyDeployment,
        response: okResponse
    }
}

describe("Deployment Tests", () => {
    describe("Get Deployment Info", () => {
        test("Get Deployment Info Full", async () => {
            appApi.listNamespacedDeployment = jest.fn(MockedlistNamespacedDeploymentFull);
            const result = await getDeploymentsInfo("api-server");
            expect(result).not.toBeUndefined();
            expect(result).not.toEqual(null);
            expect(result && result[0] && result[0]?.metadata?.name).toEqual("api-server");
            expect(result && result[0] && result[0]?.status?.replicas).toEqual(1);
            expect(result && result[0] && result[0]?.spec?.template.spec?.containers && result[0]?.spec?.template.spec?.containers[0].image).toEqual("test/api-server:978ca3eeb");
            expect(result && result[0] && result[0]?.spec?.template.spec?.containers && result[0]?.spec?.template.spec?.containers[0].resources?.limits).toEqual({ "cpu": "1", "memory": "2000Mi" });
            expect(result && result[0] && result[0]?.spec?.template.spec?.containers && result[0]?.spec?.template.spec?.containers[0].resources?.requests).toEqual({ "cpu": "1", "memory": "2000Mi" });

        });

        test("Get Deployment Info Empty", async () => {
            appApi.listNamespacedDeployment = jest.fn(MockedlistNamespacedDeploymentEmpty);
            const result = await getDeploymentsInfo("api-server");
            expect(result).toBeUndefined();

        });
    });

    describe("Patch Deployment", () => {
        test("Restart a deployment", async () => {
            appApi.patchNamespacedDeployment = jest.fn(MockedPatchNamespacedDeployment);
            const result = await restartDeployment("api-server");
            expect(result).toEqual(true);
        })

        test("Scale a deployment", async () => {
            appApi.readNamespacedDeployment = jest.fn(MockedReadNamespaceDeployment);
            appApi.replaceNamespacedDeployment = jest.fn(undefined);
            const result = await scaleDeployment("api-server", 2);
            expect(result).toBeUndefined();

        })
    });

})
