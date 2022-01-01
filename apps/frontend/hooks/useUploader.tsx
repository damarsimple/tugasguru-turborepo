import React, { useState } from 'react'
import { BACKEND } from '../config'
import { httpClient } from '../common/client';
import { toast } from 'react-toastify';
export default function useUploader() {

    const [uploadProgress, setUploadProgress] = useState(0)

    const uploadFile = async (file: File) => {

        const formData = new FormData()
        formData.append('file', file)

        const response = await httpClient.post(BACKEND + '/api/upload', formData, {
            onUploadProgress: (progressEvent) => {
                setUploadProgress((progressEvent.loaded / progressEvent.total) * 100)
            }
        })


        toast.success(response.data.message)


    }

    return {}
}
