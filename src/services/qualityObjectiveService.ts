import { api } from './api'


export class QualityObjectiveService {
    private request = (url: string, options?: RequestInit) =>
        api(url, options).then(res => res.json());

    getFormList = (): Promise<{ id: number; name: string }[]> =>
        this.request('form-response/retrieve-build-forms');
    viewResponsePdf = (response: string): Promise<Blob> =>
        api('form-response/preview-response?response=' + response, {
            method: 'GET'
        }).then(res => res.blob());
    retrieveData = (link: string, formData: any) =>
        this.request(link, { method: 'POST', body: formData });
    viewQualityObjective = (formData: any) =>
        this.request('quality-objective/view-objective', { method: 'POST', body: formData });
    storeFormResponse = (formData: any) =>
        this.request('form-response/store-form-response', { method: 'POST', body: formData });

    updateFormResponse = (formData: any) =>
        this.request('form-response/update-form-response', { method: 'POST', body: formData });

    removeFormResponse = (formData: any) =>
        this.request('form-response/remove-form-response', { method: 'POST', body: formData });
}