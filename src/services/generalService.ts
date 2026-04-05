import { api } from './api'

export type DocumentModel = 'FormDocuments' | 'ProcedureDocuments'

// 🔗 endpoints
const LINKS = {
    print: {
        FormDocuments: '/forms/form-documents/print',
        ProcedureDocuments: '/procedure/procedure-documents/print'
    },
    download: {
        FormDocuments: '/forms/form-documents/download',
        ProcedureDocuments: '/procedure/procedure-documents/download'
    },
    analytics: {
        FormDocuments: '/forms/form-documents/analytics',
        ProcedureDocuments: '/procedure/procedure-documents/analytics'
    }
}

//
// 🔹 BASIC REQUESTS
//

export const get = async <T>(url: string): Promise<T> =>
    (await api(url)).json()

export const post = async <T>(url: string, data?: any): Promise<T> =>
    (await api(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
    })).json()

export const postForm = (url: string, form: FormData) =>
    api(url, { method: 'POST', body: form })

//
// 📁 FILE HANDLING
//

export const getFile = async (url: string): Promise<Blob> =>
    (await api(url)).blob()

export const postFile = async (url: string, data: any): Promise<Blob> =>
    (await api(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })).blob()

export const download = (
    model: DocumentModel,
    form: FormData
): Promise<Blob> =>
(api(LINKS.download[model], {
    method: 'POST',
    body: form
}).then(res => res.blob()))

//
// 🖨️ PRINT
//

export const print = (
    model: DocumentModel,
    form: FormData
) =>
    api(LINKS.print[model], {
        method: 'POST',
        body: form
    })

//
// 📊 ANALYTICS
//

export const analytics = async <T>(
    model: DocumentModel,
    data: any
): Promise<T> =>
    (await post<T>(LINKS.analytics[model], data))

export const analyticsColumn = async <T>(
    model: DocumentModel,
    data: any,
    column: string
): Promise<T[]> => {
    const res = await analytics<any>(model, data)
    return res[column] || []
}