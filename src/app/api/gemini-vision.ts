import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server"

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

export async function uploadImage (name: string, filePath: string, mimeType: string): Promise<UploadFileResponse> {
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: name
  })

  return uploadResponse
}

async function analyzeImage (fileUri: string, mimeType: string): Promise<string> {
  const result = await model.generateContent([
    {
      fileData: {
        mimeType,
        fileUri
      }
    },
    { text: "Extract the numeric value from the image." }
  ])

  return result.response.text()
}

export { analyzeImage }