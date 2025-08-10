import { IDatasetBaseInput } from '../interfaces/custom/customeInterfaces';
import { PersonalInfoInput } from '../interfaces/custom/customeInterfaces';


export const adminPersonalInfoValidation = (personalInfo: PersonalInfoInput): string | null => {
    const requiredFields: (keyof PersonalInfoInput)[] = ["address", "fatherName", "motherName", "gender", "dob", "city", "state", "country", "pinCode", "nationality"];
    for (const field of requiredFields) if (personalInfo[field] === undefined || personalInfo[field] === null || personalInfo[field] === "") return field;
    return null;
};

export const datasetInputValidation = (dataset: IDatasetBaseInput): string | null => {
    const requiredFields: (keyof IDatasetBaseInput)[] = ['title', 'price', 'isPaid', 'license', 'superTypes', 'aboutDatasetInfo', 'sourceId', 'primaryCategoryId', 'securityInfo', 'locationInfo', 'categories', 'datasetUniqueId'];
    for (const field of requiredFields) { if (dataset[field] === undefined || dataset[field] === null || dataset[field] === "") return field; }
    return null;
}
