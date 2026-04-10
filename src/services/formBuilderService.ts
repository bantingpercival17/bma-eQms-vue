import { api } from './api'


export class FormBuilderService {
    getFormList = async (): Promise<{ id: number; name: string }[]> =>
        (await api('form-builder/retrieve-forms')).json()

    storeForm = async (formData: any): Promise<any> => {
        const res = await api('form-builder/create-form', {
            method: 'POST',
            body: formData,
        })
        return res.json();
    }
    buildFormList = async (): Promise<any> => {
        const response = await api('form-builder/retrieve-build-forms')
        return response.json();
    }
    storeFormResponse = async (formData: any): Promise<any> => {
        const res = await api('form-builder/store-form-response', {
            method: 'POST',
            body: formData,
        })
        return res.json();
    }
}