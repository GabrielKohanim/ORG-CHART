import axios from 'axios'

const API_BASE_URL = 'https://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const suggestChanges = async (chartData) => {
  try {
    const response = await api.post('/api/suggest', {
      chart: chartData
    })
    // Return both modifiedChart and changes
    return response.data
  } catch (error) {
    console.error('Error suggesting changes:', error)
    throw error
  }
}

export const aiGenerateOrgChart = async (prompt, mode = 'text', imageData = null) => {
  try {
    const payload = {
      mode: mode,
      prompt: prompt
    }
    
    if (mode === 'image_and_text' && imageData) {
      payload.image_data = imageData
    }
    
    const response = await api.post('/api/ai-generate-orgchart', payload)
    return response.data
  } catch (error) {
    console.error('Error generating org chart from AI:', error)
    throw error
  }
}

export const uploadLogo = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await api.post('/api/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail)
    }
    throw error
  }
}

export default api 