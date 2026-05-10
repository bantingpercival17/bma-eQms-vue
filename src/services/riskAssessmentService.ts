import { api } from './api'


export class RiskAssessmentsService {
    private request = (url: string, options?: RequestInit) =>
        api(url, options).then(res => res.json());

    getFormList = (): Promise<{ id: number; name: string }[]> =>
        this.request('form-response/retrieve-build-forms');
    viewResponsePdf = (response: string): Promise<Blob> =>
        api('form-response/preview-response?response=' + response, {
            method: 'GET'
        }).then(res => res.blob());
    retrieveDataList = (formData: any) =>
        this.request('risk-and-opportunity/retrieveDataList', { method: 'POST', body: formData });
    view = (formData: any) =>
        this.request('risk-and-opportunity/view-objective', { method: 'POST', body: formData });
    store = (formData: any) =>
        this.request('risk-and-opportunity/store-form-response', { method: 'POST', body: formData });

    update = (formData: any) =>
        this.request('risk-and-opportunity/update-form-response', { method: 'POST', body: formData });

    remove = (formData: any) =>
        this.request('risk-and-opportunity/remove-form-response', { method: 'POST', body: formData });
}