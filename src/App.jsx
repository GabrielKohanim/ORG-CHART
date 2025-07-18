import React, { useState, useCallback } from 'react'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer'
import 'react-flow-renderer/dist/style.css'
import Toolbar from './Toolbar'
import LoadingOverlay from './LoadingOverlay'
import OrgChart from './OrgChart'
import EmployeeInfoPanel from './EmployeeInfoPanel'
import { suggestChanges } from './api/suggest'
import './assets/styles.css'
import axios from 'axios'
import AIDecisionPopup from './AIDecisionPopup'
import SummaryModal from './SummaryModal'
import ChatModal from './ChatModal'
import { aiGenerateOrgChart } from './api/suggest'
import ImageDropZone from './ImageDropZone'
import { uploadLogo } from './api/suggest'

const initialNodes = [
  {
    id: '1',
    type: 'orgNode',
    position: { x: 400, y: 50 },
    data: { 
      name: 'CEO', 
      role: 'Chief Executive Officer',
      avatar: null,
      department: 'Executive',
      customDepartment: '',
      email: '',
      phone: '',
      skills: '',
      notes: ''
    },
  },
  {
    id: '2',
    type: 'orgNode',
    position: { x: 200, y: 200 },
    data: { 
      name: 'CTO', 
      role: 'Chief Technology Officer',
      avatar: null,
      department: 'Technology',
      customDepartment: '',
      email: '',
      phone: '',
      skills: '',
      notes: ''
    },
  },
  {
    id: '3',
    type: 'orgNode',
    position: { x: 400, y: 200 },
    data: { 
      name: 'CFO', 
      role: 'Chief Financial Officer',
      avatar: null,
      department: 'Finance',
      customDepartment: '',
      email: '',
      phone: '',
      skills: '',
      notes: ''
    },
  },
  {
    id: '4',
    type: 'orgNode',
    position: { x: 600, y: 200 },
    data: { 
      name: 'CMO', 
      role: 'Chief Marketing Officer',
      avatar: null,
      department: 'Marketing',
      customDepartment: '',
      email: '',
      phone: '',
      skills: '',
      notes: ''
    },
  },
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
]

const nodeTypes = {
  orgNode: OrgChart,
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [loading, setLoading] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [toast, setToast] = useState({ type: '', message: '' })
  const [aiChangeQueue, setAIChangeQueue] = useState([])
  const [pendingChart, setPendingChart] = useState(null)
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [currentChangeIdx, setCurrentChangeIdx] = useState(0)
  const [decisionLog, setDecisionLog] = useState([])
  const [showSummary, setShowSummary] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiPrompt, setAIPrompt] = useState('')
  const [aiAssistantLoading, setAIAssistantLoading] = useState(false)
  const [aiAssistantError, setAIAssistantError] = useState('')
  const [imageDropActive, setImageDropActive] = useState(false)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const handleNodeClick = (event, node) => {
    setSelectedNode(node)
  }

  const handleClosePanel = () => {
    setSelectedNode(null)
  }

  const handleAddNode = () => {
    const newNode = {
      id: `${Date.now()}`,
      type: 'orgNode',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 200 + 300 },
      data: { 
        name: 'New Employee', 
        role: 'Click to edit',
        avatar: null,
        department: 'Unassigned',
        customDepartment: '',
        email: '',
        phone: '',
        skills: '',
        notes: ''
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const handleRemoveNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }

  const handleUpdateNode = (nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
      )
    )
  }

  const handleProposeChanges = async () => {
    setLoading(true)
    try {
      const chartData = {
        nodes: nodes.map(node => ({
          id: node.id,
          name: node.data.name,
          role: node.data.role,
          department: node.data.department,
          position: node.position
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target
        }))
      }
      const response = await suggestChanges(chartData)
      if (response.changes && response.changes.length > 0) {
        setAIChangeQueue(response.changes)
        setPendingChart(response.modifiedChart)
        setCurrentChangeIdx(0)
        setShowAIPopup(true)
        setDecisionLog([])
      } else if (response.modifiedChart) {
        // No changes, just update chart
        const updatedNodes = response.modifiedChart.nodes.map(node => ({
          id: node.id,
          type: 'orgNode',
          position: node.position || { x: Math.random() * 400 + 200, y: Math.random() * 200 + 200 },
          data: {
            name: node.name,
            role: node.role,
            department: node.department,
            avatar: null
          }
        }))
        const updatedEdges = response.modifiedChart.edges.map(edge => ({
          id: `e${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target
        }))
        setNodes(updatedNodes)
        setEdges(updatedEdges)
      }
    } catch (error) {
      console.error('Error proposing changes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAIPopupDecision = (accepted) => {
    const currentChange = aiChangeQueue[currentChangeIdx]
    setDecisionLog(log => [...log, { ...currentChange, accepted }])
    if (currentChangeIdx < aiChangeQueue.length - 1) {
      setCurrentChangeIdx(idx => idx + 1)
    } else {
      // All reviewed, apply only accepted changes
      if (pendingChart) {
        // Build new chart by applying only accepted changes
        const acceptedIds = decisionLog.concat({ ...currentChange, accepted }).filter(d => d.accepted).map(d => d.employeeId)
        // Filter nodes/edges to only those in accepted changes, or keep all if no filter (for now, apply all if any accepted)
        // For MVP: if any accepted, use pendingChart; else, keep current chart
        if (acceptedIds.length > 0) {
          const updatedNodes = pendingChart.nodes.map(node => ({
            id: node.id,
            type: 'orgNode',
            position: node.position || { x: Math.random() * 400 + 200, y: Math.random() * 200 + 200 },
            data: {
              name: node.name,
              role: node.role,
              department: node.department,
              avatar: null
            }
          }))
          const updatedEdges = pendingChart.edges.map(edge => ({
            id: `e${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target
          }))
          setNodes(updatedNodes)
          setEdges(updatedEdges)
        }
      }
      setShowAIPopup(false)
      setAIChangeQueue([])
      setPendingChart(null)
      setCurrentChangeIdx(0)
      setShowSummary(true)
    }
  }

  const handleExportLog = () => {
    const blob = new Blob([JSON.stringify(decisionLog, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ai_decision_log_${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCloseSummary = () => {
    setShowSummary(false)
    setDecisionLog([])
  }

  const handleSaveChart = async () => {
    try {
      const chartData = {
        nodes: nodes.map(node => {
          // Support both text and image nodes
          if (node.data.type === 'image') {
            return {
              id: node.id,
              type: 'image',
              src: node.data.src,
              title: node.data.title,
              description: node.data.description,
              position: node.position
            }
          } else {
            return {
              id: node.id,
              name: node.data.name,
              role: node.data.role,
              department: node.data.department,
              customDepartment: node.data.customDepartment,
              email: node.data.email,
              phone: node.data.phone,
              skills: node.data.skills,
              notes: node.data.notes,
              position: node.position,
              avatar: node.data.avatar || null,
              type: 'text'
            }
          }
        }),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target
        }))
      }
      const response = await axios.post('http://localhost:8000/api/save', chartData, {
        responseType: 'blob'
      })
      // Get filename from header or use default
      let filename = response.headers['content-disposition']?.split('filename=')[1] || `orgchart_${Date.now()}.json`
      filename = filename.replace(/"/g, '')
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      setToast({ type: 'success', message: 'Org chart saved!' })
      setTimeout(() => setToast({ type: '', message: '' }), 2000)
    } catch (e) {
      setToast({ type: 'error', message: 'Failed to save org chart.' })
      setTimeout(() => setToast({ type: '', message: '' }), 3000)
    }
  }

  const handleLoadChart = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post('http://localhost:8000/api/load', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data && response.data.nodes && response.data.edges) {
        // Update chart with loaded data
        const loadedNodes = response.data.nodes.map(node => {
          if (node.type === 'image') {
            return {
              id: node.id,
              type: 'orgNode',
              position: node.position || { x: Math.random() * 400 + 200, y: Math.random() * 200 + 200 },
              data: {
                type: 'image',
                src: node.src,
                title: node.title || '',
                description: node.description || ''
              }
            }
          } else {
            return {
              id: node.id,
              type: 'orgNode',
              position: node.position || { x: Math.random() * 400 + 200, y: Math.random() * 200 + 200 },
              data: {
                name: node.name,
                role: node.role,
                department: node.department,
                customDepartment: node.customDepartment || '',
                email: node.email || '',
                phone: node.phone || '',
                skills: node.skills || '',
                notes: node.notes || '',
                avatar: node.avatar || null,
                type: 'text'
              }
            }
          }
        })
        const loadedEdges = response.data.edges.map(edge => ({
          id: `e${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target
        }))
        setNodes(loadedNodes)
        setEdges(loadedEdges)
        setToast({ type: 'success', message: 'Org chart loaded!' })
        setTimeout(() => setToast({ type: '', message: '' }), 2000)
      } else {
        throw new Error('Invalid org chart file.')
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Invalid org chart file.' })
      setTimeout(() => setToast({ type: '', message: '' }), 3000)
      throw e
    }
  }

  const handleOpenAIAssistant = () => {
    setShowAIAssistant(true)
    setAIPrompt('')
    setAIAssistantError('')
  }
  const handleCloseAIAssistant = () => {
    setShowAIAssistant(false)
    setAIPrompt('')
    setAIAssistantError('')
  }
  const handleAIPromptChange = (val) => setAIPrompt(val)

  const handleAIAssistantSubmit = async (prompt, mode = 'text', imageData = null) => {
    setAIAssistantLoading(true)
    setAIAssistantError('')
    try {
      const result = await aiGenerateOrgChart(prompt, mode, imageData)
      if (result && result.orgChart && result.orgChart.nodes && result.orgChart.edges) {
        // Render the returned org chart
        const loadedNodes = result.orgChart.nodes.map(node => {
          if (node.type === 'image') {
            return {
              id: node.id,
              type: 'orgNode',
              position: node.position || { x: Math.random() * 400 + 200, y: Math.random() * 200 + 200 },
              data: {
                type: 'image',
                src: node.src,
                title: node.title || '',
                description: node.description || ''
              }
            }
          } else {
            return {
              id: node.id,
              type: 'orgNode',
              position: node.position || { x: Math.random() * 400 + 200, y: Math.random() * 200 + 200 },
              data: {
                name: node.name,
                role: node.role,
                department: node.department,
                customDepartment: node.customDepartment || '',
                email: node.email || '',
                phone: node.phone || '',
                skills: node.skills || '',
                notes: node.notes || '',
                avatar: node.avatar || null,
                type: 'text'
              }
            }
          }
        })
        const loadedEdges = result.orgChart.edges.map(edge => ({
          id: `e${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target
        }))
        setNodes(loadedNodes)
        setEdges(loadedEdges)
        setShowAIAssistant(false)
        setAIPrompt('')
      } else {
        setAIAssistantError('AI did not return a valid org chart. Please try again or rephrase your request.')
      }
    } catch (e) {
      setAIAssistantError('Failed to generate org chart. Please try again.')
    } finally {
      setAIAssistantLoading(false)
    }
  }

  // Handle logo upload (button-based)
  const handleUploadLogo = async (file) => {
    // Center of chart (or fallback)
    const center = { x: 400, y: 200 }
    const res = await uploadLogo(file)
    const newNode = {
      id: `img_${res.id}`,
      type: 'orgNode',
      position: center,
      data: {
        type: 'image',
        src: res.url,
        title: '',
        description: ''
      }
    }
    setNodes((nds) => [...nds, newNode])
  }

  return (
    <div className="app">
      <Toolbar 
        onAddNode={handleAddNode}
        onProposeChanges={handleProposeChanges}
        onSaveChart={handleSaveChart}
        onLoadChart={handleLoadChart}
        onOpenAIAssistant={handleOpenAIAssistant}
        onUploadLogo={handleUploadLogo}
      />
      
      <div className="flow-container" style={{ position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <Background />
          <MiniMap />
        </ReactFlow>
      </div>

      {selectedNode && (
        <>
          <div className="sidebar-backdrop" onClick={handleClosePanel}></div>
          <EmployeeInfoPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onClose={handleClosePanel}
            onRemoveNode={handleRemoveNode}
          />
        </>
      )}

      {loading && <LoadingOverlay />}
      {toast.message && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.message}</div>
      )}
      {showAIPopup && aiChangeQueue.length > 0 && (
        <AIDecisionPopup
          change={aiChangeQueue[currentChangeIdx]}
          idx={currentChangeIdx}
          total={aiChangeQueue.length}
          onDecision={handleAIPopupDecision}
        />
      )}
      {showSummary && (
        <SummaryModal
          decisionLog={decisionLog}
          onExport={handleExportLog}
          onClose={handleCloseSummary}
        />
      )}
      <ChatModal
        open={showAIAssistant}
        onClose={handleCloseAIAssistant}
        onSubmit={handleAIAssistantSubmit}
        loading={aiAssistantLoading}
        error={aiAssistantError}
        orgChart={null}
        onPromptChange={handleAIPromptChange}
        prompt={aiPrompt}
      />
    </div>
  )
}

export default App 