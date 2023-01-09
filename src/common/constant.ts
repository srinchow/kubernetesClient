export const serviceType = [
    "ExternalName",
    "ClusterIP",
    "NodePort",
    "LoadBalancer"
]

export const httpConstants = {
    RESPONSE_CODES: {
        UNAUTHORIZED: 401,
        SERVER_ERROR: 500,
        NOT_FOUND: 404,
        OK: 200,
        NO_CONTENT_FOUND: 204,
        BAD_REQUEST: 400,
        FORBIDDEN: 403,
        GONE: 410,
        UNSUPPORTED_MEDIA_TYPE: 415,
        TOO_MANY_REQUEST: 429
    }
}

export const enum PodLifeCycleStage {
    PENDING = "Pending",
    RUNNING = "Running",
    SUCCEEDED = "Succeeded",
    FAILED = "Failed",
    UNKNOWN = "Unknown"
}
export const enum PodOkayStatus {
    RUNNING = "Running",
    SUCCEEDED = "Succeeded"
}
export const enum PodFailedStatus {
    FAILED = "Failed",
    UNKNOWN = "Unknown"
}



export const cpuResourceUnitConversion = new Map<string, number>([["m", 1000]]);

const memoryResourceUnitConversionInternal = () => {
    const decimalUnits: string[] = ['k', 'M', 'G', 'T', 'P', 'E'];
    const base2Units: string[] = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei'];

    const decimalBase = 1000;
    const base2 = 1024;

    const unitConversion: Map<string, number> = new Map<string, number>();

    decimalUnits.forEach((val, index) => {
        unitConversion.set(val, Math.pow(decimalBase, index + 1));
    })

    base2Units.forEach((val, index) => {
        unitConversion.set(val, Math.pow(base2, index + 1));
    })

    return unitConversion;
}

export const memoryResourceUnitConversion = memoryResourceUnitConversionInternal();