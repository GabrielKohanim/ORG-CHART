# Org Chart Builder

A full-stack organizational chart builder with AI-assisted suggestions powered by Pinecone RAG technology.

## 🚀 Features

- **Interactive Org Chart Editor**: Drag, drop, and edit organizational nodes
- **AI-Powered Suggestions**: Get intelligent recommendations for organizational improvements
- **Modern UI**: Clean, responsive design with smooth animations
- **Real-time Updates**: Dynamic chart updates with visual feedback
- **Department Color Coding**: Visual distinction between different departments
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast development
- **React Flow** for interactive org chart visualization
- **Modern CSS** with animations and responsive design
- **Axios** for API communication

### Backend
- **FastAPI** for high-performance API
- **Pinecone RAG** for AI-powered suggestions
- **Pydantic** for data validation
- **CORS** enabled for frontend communication

## 📋 Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Pinecone API key

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd orgchart
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env and add your Pinecone API key
```

### 4. Configure API Keys
1. Get your Pinecone API key from [Pinecone Console](https://app.pinecone.io/)
2. Get your Google API key from [Google AI Studio](https://aistudio.google.com/)
3. Add both to the `.env` file:
```
PINECONE_API_KEY=your_actual_pinecone_api_key_here
GOOGLE_API_KEY=your_actual_google_api_key_here
```

### 5. Start the Backend
```bash
# Run the FastAPI server
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

## 🎯 Usage

### Basic Operations

1. **View the Chart**: The app loads with a sample organizational structure
2. **Add Employees**: Click "Add Employee" and fill in the details
3. **Edit Employees**: Double-click on any node to edit details
4. **Move Nodes**: Drag and drop nodes to reposition them
5. **Connect Nodes**: Drag from one node's handle to another to create connections
6. **Select Nodes**: Click on a node to select it and see editing options

### AI Suggestions

1. **Request AI Changes**: Click "🤖 Propose AI Changes" button
2. **Wait for Analysis**: The AI will analyze your current structure
3. **Review Changes**: The chart will update with AI-suggested improvements
4. **Iterate**: Make further manual adjustments as needed

### Department Management

The app supports the following departments with color coding:
- **Executive** (Blue)
- **Technology** (Green)
- **Finance** (Orange)
- **Marketing** (Purple)
- **HR** (Red)
- **Sales** (Yellow)
- **General** (Gray)

## 🔧 API Endpoints

### GET `/`
- Health check endpoint
- Returns API information

### GET `/health`
- Service health status

### POST `/api/suggest`
- **Request Body**:
```json
{
  "chart": {
    "nodes": [
      {
        "id": "1",
        "name": "Employee Name",
        "role": "Job Title",
        "department": "Department",
        "position": {"x": 100, "y": 100}
      }
    ],
    "edges": [
      {
        "source": "1",
        "target": "2"
      }
    ]
  }
}
```

- **Response**:
```json
{
  "modifiedChart": {
    "nodes": [...],
    "edges": [...]
  }
}
```

## 🎨 Customization

### Styling
- Edit `src/assets/styles.css` to customize colors, fonts, and animations
- The app uses Inter font family and a professional color scheme
- All components are responsive and mobile-friendly

### Adding New Departments
1. Update the department options in `src/OrgChart.jsx` and `src/Toolbar.jsx`
2. Add color mappings in the `getDepartmentColor` function
3. Update the schema in `shared/orgChartSchema.json`

### Extending AI Capabilities
- Modify the prompt in `main.py` to change AI behavior
- Add more context or specific instructions for different use cases
- The RAG agent can be enhanced with additional training data

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# The built files will be in the `dist` directory
```

### Backend Deployment
```bash
# Using uvicorn with production settings
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Variables
Make sure to set the following environment variables in production:
- `PINECONE_API_KEY`: Your Pinecone API key

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS settings match your frontend URL
2. **Pinecone Connection**: Verify your API key is correct and the assistant exists
3. **Node Dependencies**: Run `npm install` if you encounter module errors
4. **Python Dependencies**: Run `pip install -r requirements.txt` for backend issues

### Debug Mode
- Frontend: Check browser console for React errors
- Backend: Check terminal output for FastAPI logs
- AI Responses: Check backend logs for RAG agent responses

## 📁 Project Structure

```
orgchart/
├── src/                    # Frontend source code
│   ├── App.jsx            # Main application component
│   ├── OrgChart.jsx       # Custom org chart node component
│   ├── Toolbar.jsx        # Toolbar with controls
│   ├── LoadingOverlay.jsx # Loading spinner component
│   ├── api/               # API service functions
│   └── assets/            # Styles and assets
├── main.py                # FastAPI backend
├── pineconesoft.py        # RAG agent integration
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
├── shared/                # Shared schemas and utilities
├── testChart.json         # Example data
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) for the interactive chart functionality
- [FastAPI](https://fastapi.tiangolo.com/) for the high-performance backend
- [Vite](https://vitejs.dev/) for the fast development experience 