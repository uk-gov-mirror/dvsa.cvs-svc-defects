import { HTTPError } from "../../src/models/HTTPError";

export class DefectsDAOMock {
    public static defectRecordsMock: any;
    public static numberOfRecords: number | null;
    public static numberOfScannedRecords: number | null;
    public static isDatabaseOn: boolean;

    constructor() {
        DefectsDAOMock.defectRecordsMock = null;
        DefectsDAOMock.numberOfRecords = null;
        DefectsDAOMock.numberOfScannedRecords = null;
        DefectsDAOMock.isDatabaseOn = true;
    }

    /**
     * Mock getAll function
     */
    public getAll() {
        const responseObject = {
            Items: DefectsDAOMock.defectRecordsMock,
            Count: DefectsDAOMock.numberOfRecords,
            ScannedCount: DefectsDAOMock.numberOfScannedRecords
        };

        if (!DefectsDAOMock.isDatabaseOn) { return Promise.reject(responseObject); }

        return Promise.resolve(responseObject);
    }

    /**
     * Mock createMultiple function
     */
    public createMultiple() {
        if (!DefectsDAOMock.isDatabaseOn) { return Promise.reject(new HTTPError(500, "Internal Server Error")); }
        return Promise.resolve({ UnprocessedItems: {} });
    }

    /**
     * Mock deleteMultiple function
     */
    public deleteMultiple() {
        if (!DefectsDAOMock.isDatabaseOn) { return Promise.reject(new HTTPError(500, "Internal Server Error")); }
        return Promise.resolve({ UnprocessedItems: {} });
    }
}
