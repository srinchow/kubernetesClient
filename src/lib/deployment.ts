import { PatchUtils } from "@kubernetes/client-node";
import { appApi } from "../client/client";
import { httpConstants } from "../common/constant";

export const getDeploymentsInfo = async (deploymentName: string, namespace = "default") => {
    const { body, response } = await appApi.listNamespacedDeployment(namespace, undefined, undefined, undefined, `metadata.name=${deploymentName}`, '');
    console.debug(`Response with statusCode ${response?.statusCode} message : ${response?.statusMessage}`);
    if (body.items.length !== 0) return body.items;
}


export const restartDeployment = async (deploymentName: string, namespace = "default") => {
    const options = { "headers": { "Content-type": PatchUtils.PATCH_FORMAT_JSON_PATCH } };
    const patch = [
        {
            "op": "add",
            "path": "/metadata/annotations",
            "value": {
                "kubectl.kubernetes.io/restartedAt": new Date().getTime()
            }
        }
    ];
    const result = await appApi.patchNamespacedDeployment(deploymentName, namespace, patch, undefined, undefined, undefined, false, options);
    if (result.response?.statusCode === httpConstants.RESPONSE_CODES.OK) return true;
    return false;
}


export const scaleDeployment = async (deploymentName: string, replicas: number, namespace = "default") => {
    // find the particular deployment
    const { body } = await appApi.readNamespacedDeployment(deploymentName, namespace);
    if (!body?.spec) return;
    // edit
    body.spec.replicas = replicas
    // replace
    await appApi.replaceNamespacedDeployment(deploymentName, namespace, body);
}