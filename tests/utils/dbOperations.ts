import * as fs from "fs";
import * as path from "path";
import { DefectsDAO } from "../../src/models/DefectsDAO";
import { DefectsService } from "../../src/services/DefectsService";
import defects from "../resources/defects.json";
import * as _ from "lodash";

export const populateTestDatabase = async () => {
    const full: boolean = false;
    await populateDatabase(full);
};

export const populateDatabase = async (full = true) => {
    const defectsMockDB = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/defects.json"), "utf8"));
    const defectsService = new DefectsService(new DefectsDAO());
    if (full) {
        await defectsService.insertDefectList(_.cloneDeep(defectsMockDB).splice(0, 20));
    } else {
        await defectsService.insertDefectList(_.cloneDeep(defectsMockDB).splice(0, 5));
    }
};

export const emptyTestDatabase = async () => {

    const full: boolean = false;
    await emptyDatabase(full);
};

export const emptyDatabase = async (full = true) => {
    const defectIds = defects.map((item: { id: any; }) => {
        return item.id;
    });

    const defectsService = new DefectsService(new DefectsDAO());
    if (full) {
        await defectsService.deleteDefectList(_.cloneDeep(defectIds));
    } else {
        await defectsService.deleteDefectList(_.cloneDeep(defectIds).splice(0, 5));
    }
};


