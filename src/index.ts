
import { getAllPodsForDeployment, getPod, getPodContainerImages, getPodsToStatusMapping, getPodStatus } from "./lib/pod"
import { getDeploymentsInfo, restartDeployment, scaleDeployment } from "./lib/deployment"
import { getService, getServiceLoadBalancer, getServiceOfType } from "./lib/service"

exports = {
    getAllPodsForDeployment,
    getPod,
    getPodContainerImages,
    getPodStatus,
    getPodsToStatusMapping,
    getDeploymentsInfo,
    restartDeployment,
    scaleDeployment,
    getService,
    getServiceLoadBalancer,
    getServiceOfType
}




