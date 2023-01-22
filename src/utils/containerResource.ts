/* eslint-disable @typescript-eslint/no-unused-vars */
import { cpuResourceUnitConversion, memoryResourceUnitConversion } from "../common/constant"

export type ResourceUtilization = { name: string, cpuUtilizationOverLimit?: number, memoryUtilizationOverLimit?: number };


export type k8Memory = string;
export type k8CPU = string;

const k8ContainerResourceRegex = /(\d+)(\w*)/gm;


export const convertUnit = (k8Resource: k8Memory | k8Memory | undefined): number | undefined => {
    if (!k8Resource) return;
    const matches = k8Resource.matchAll(k8ContainerResourceRegex);
    for (const match of matches) {
        const [_, val, unit] = match;
        const baseVal = Number(val);
        const multiplier = getUnitConversion(unit);
        return baseVal * multiplier;
    }

}


function getUnitConversion(unit: k8CPU | k8Memory): number {
    // "100"
    if (!unit || unit.length == 0) return 1;

    //"1000m"
    const cpuUnit = cpuResourceUnitConversion.get(unit);
    if (cpuUnit) return cpuUnit;

    //"1000Mi"
    const memoryUnit = memoryResourceUnitConversion.get(unit);
    if (memoryUnit) return memoryUnit;

    throw new Error("No Matching unit for resource");
}