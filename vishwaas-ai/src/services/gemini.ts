import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  isFake: boolean;
  confidenceScore: number;
  findings: string;
  manipulationType: string[];
  metadata: {
    resolution?: string;
    format?: string;
    fileSize?: string;
  };
}

export async function analyzeMedia(file: File): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  // Check file size (Gemini inlineData limit is 20MB)
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large. Maximum allowed size is 20MB.");
  }

  let base64Data: string;
  try {
    base64Data = await fileToBase64(file);
  } catch (error) {
    console.error("File conversion error:", error);
    throw new Error("Failed to process the file. It might be corrupted.");
  }

  const mimeType = file.type;
  const isDocument = mimeType === 'application/pdf' || mimeType.startsWith('text/') || 
                     file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.txt');

  const prompt = isDocument ? `
    Analyze this document for signs of forgery, digital alteration, or AI generation.
    
    Provide your analysis in the following JSON format:
    {
      "isFake": boolean,
      "confidenceScore": number (0-100),
      "findings": "Detailed explanation of font inconsistencies, digital signature anomalies, metadata issues, or AI-generated text patterns",
      "manipulationType": ["Forgery", "AI Generated Content", "Digital Alteration", "Metadata Tampering", "None"],
      "metadata": {
        "resolution": "string",
        "format": "string",
        "fileSize": "string"
      }
    }
    
    Look for:
    - Font mismatches or irregular spacing
    - Digital signature validity
    - Inconsistent metadata (creation dates vs modification dates)
    - AI-generated text patterns (hallucinations, overly formal structure)
    - Visual artifacts in scanned documents (cloning, copy-paste)
  ` : `
    Analyze this ${mimeType.startsWith('video') ? 'video' : 'image'} for signs of deepfake manipulation, digital alteration, or AI generation.
    
    Provide your analysis in the following JSON format:
    {
      "isFake": boolean,
      "confidenceScore": number (0-100),
      "findings": "Detailed explanation of visual inconsistencies, artifacts, or markers found",
      "manipulationType": ["Face Swap", "Voice Cloning", "Generative AI", "Digital Editing", "None"],
      "metadata": {
        "resolution": "string",
        "format": "string",
        "fileSize": "string"
      }
    }
    
    Look for:
    - Inconsistent lighting or shadows
    - Unnatural skin textures or blurring
    - Eye/mouth synchronization issues (for videos)
    - Background warping
    - Digital artifacts or noise patterns
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    if (!response || !response.text) {
      // Check if it was blocked by safety filters
      if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error("Analysis blocked: The content was flagged by safety filters.");
      }
      throw new Error("The AI engine failed to generate a response. Please try again.");
    }

    const result = JSON.parse(response.text.trim());
    return {
      isFake: result.isFake ?? false,
      confidenceScore: result.confidenceScore ?? 0,
      findings: result.findings ?? "No detailed findings provided.",
      manipulationType: result.manipulationType ?? [],
      metadata: result.metadata ?? {}
    };
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    
    if (error.message?.includes("fetch")) {
      throw new Error("Network error: Unable to connect to the AI analysis server.");
    }
    
    if (error instanceof SyntaxError) {
      throw new Error("The AI returned an invalid data format. Please try re-scanning.");
    }

    // Re-throw if it's already a specific error we created
    if (error.message?.includes("Analysis blocked") || error.message?.includes("AI engine failed")) {
      throw error;
    }

    throw new Error(error.message || "An unexpected error occurred during forensic analysis.");
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}
