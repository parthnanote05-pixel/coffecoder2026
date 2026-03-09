# VISHWAAS-AI: Digital Trust Engine

An advanced AI-powered platform for detecting deepfakes, face manipulation, and digital misinformation in images, videos, and documents. Built with Google's Gemini AI to help combat digital deception and restore trust in media content.

## ✨ Features

### 🔍 Advanced Media Analysis
- **Deepfake Detection**: Identifies face swaps, voice cloning, and AI-generated content
- **Document Forgery Analysis**: Detects font inconsistencies, digital signature anomalies, and metadata tampering
- **Visual Artifact Detection**: Analyzes lighting, shadows, skin textures, and background warping
- **AI Content Recognition**: Identifies AI-generated text patterns and hallucinations

### 📁 Multi-Format Support
- **Images**: JPEG, PNG, WebP, and other common formats
- **Videos**: MP4, AVI, MOV, and video files
- **Documents**: PDF, DOCX, TXT files
- **File Size**: Up to 20MB per file

### 🎨 User Experience
- **Drag & Drop Interface**: Easy file upload with visual feedback
- **Real-time Analysis**: Instant results with confidence scores
- **Analysis History**: Local storage of previous analyses (last 10)
- **Dark/Light Mode**: Theme switching with persistence
- **Responsive Design**: Works seamlessly on desktop and mobile

### 📊 Detailed Reporting
- **Confidence Scores**: 0-100% accuracy ratings
- **Manipulation Types**: Categorized findings (Face Swap, AI Generated, Digital Editing, etc.)
- **Visual Charts**: Pie charts for risk assessment
- **Metadata Display**: File information and analysis details

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Google Gemini API Key** (get one from [Google AI Studio](https://ai.google.dev/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vishwaas-ai
   ```

2. **Install dependencies:**
   ``` cd "C:\Users\parth\OneDrive\Desktop\VISHWAS-AI\vishwaas-ai"
       npm install


4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000` to access the application.

## 🛠️ Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run clean` - Remove build artifacts
- `npm run lint` - Run TypeScript type checking

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Motion/React** - Animation library for smooth interactions

### AI & Data
- **Google Gemini AI** - Advanced multimodal AI for content analysis
- **Recharts** - Data visualization library
- **React Markdown** - Markdown rendering for analysis results

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Autoprefixer** - CSS vendor prefixing

## 📖 Usage

1. **Upload Media**: Drag and drop or click to select files
2. **Automatic Analysis**: AI analyzes the content for manipulation signs
3. **Review Results**: View confidence scores and detailed findings
4. **Access History**: Check previous analyses from the sidebar

### Supported File Types
- Images: `.jpg`, `.png`, `.webp`, `.gif`
- Videos: `.mp4`, `.avi`, `.mov`, `.mkv`
- Documents: `.pdf`, `.docx`, `.txt`

## 🔐 Security & Privacy

- **Client-side Processing**: Files are analyzed locally using AI APIs
- **No Data Storage**: Uploaded files are not stored on servers
- **API Key Security**: Sensitive keys stored in environment variables
- **Local History**: Analysis history stored only in browser localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is part of AI Studio. See the license file for details.

## 🔗 Links

- [View in AI Studio](https://ai.studio/apps/c52d48dc-e30d-40a7-b4bb-91d98fa9fa38)
- [Google AI Studio](https://ai.google.dev/)
- [Gemini API Documentation](https://ai.google.dev/docs)



### Backend

-mongodb://localhost:27017/