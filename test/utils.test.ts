import { convertUnit, k8CPU, k8Memory } from '../src/utils/resource';
import { describe, expect, test, jest } from '@jest/globals';

describe("Unit Conversion", () => {
    test("Cpu Unit Conversion", () => {
        const testcases = {
            "4": 4,
            "400m": 0.4
        }
        for (const [testcase, expectedValue] of Object.entries(testcases)) {
            const result = Number(convertUnit(testcase))
            expect(result).toEqual(expectedValue);
        }
    });


    test("Memory Unit Conversion", () => {
        const testcases = {
            "123Mi": 128974848,
            "123M": 123000000,
            "123k": 123000,
            "123E": 123000000000000000000,
            "123": 123,
            "123000m": 123,
        }

        for (const [testcase, expectedValue] of Object.entries(testcases)) {
            const result = Number(convertUnit(testcase))
            expect(result).toEqual(expectedValue);
        }
    })


})