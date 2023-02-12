import { convertUnit, k8CPU, k8Memory } from '../src/utils/resource';
import { describe, expect, test, jest } from '@jest/globals';

describe("Unit Conversion", () => {
    test("Cpu Unit Conversion", () => {
        const cpu: k8CPU = "4";
        const result = convertUnit(cpu);
        expect(Number(result)).toEqual(4);

        const cpu1: k8CPU = "400m";
        const result1 = convertUnit(cpu1);
        expect(Number(result1)).toEqual(0.4);

    });


    test("Memory Unit Conversion", () => {
        const cases = {
            "123Mi": 128974848,
            "123M": 123000000,
            "123k": 123000,
            "123E": 123000000000000000000,
            "123": 123,
            "123000m": 123,
        }

        for (const [testcase, expectedValue] of Object.entries(cases)) {
            const result = Number(convertUnit(testcase))
            expect(result).toEqual(expectedValue);
        }
    })


})