import React, { useState, useEffect } from 'react'

interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  mode: 'create' | 'edit'
  initialData?: {
    id?: string
    title?: string
    subject?: string
    class?: string
    description?: string
    dueDate?: string
    totalMarks?: number
    type?: 'homework' | 'project' | 'lab' | 'quiz'
    priority?: 'low' | 'medium' | 'high'
    totalStudents?: number
  } | null
}

export default function AssignmentModal({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData
}: AssignmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    description: '',
    dueDate: '',
    totalMarks: 100,
    type: 'homework' as 'homework' | 'project' | 'lab' | 'quiz',
    priority: 'medium' as 'low' | 'medium' | 'high',
    totalStudents: 30,
    instructions: '',
    allowLateSubmission: false,
    gradeWeightage: 0
  })

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || '',
        subject: initialData.subject || '',
        class: initialData.class || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate || '',
        totalMarks: initialData.totalMarks || 100,
        type: initialData.type || 'homework',
        priority: initialData.priority || 'medium',
        totalStudents: initialData.totalStudents || 30
      }))
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        subject: '',
        class: '',
        description: '',
        dueDate: '',
        totalMarks: 100,
        type: 'homework',
        priority: 'medium',
        totalStudents: 30,
        instructions: '',
        allowLateSubmission: false,
        gradeWeightage: 0
      })
    }
  }, [initialData, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const subjects = [
    'Computer Science',
    'Data Structures',
    'Database Management',
    'Web Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Software Engineering',
    'Operating Systems',
    'Computer Networks'
  ]

  const classes = [
    'CS-1A', 'CS-1B', 'CS-2A', 'CS-2B',
    'CS-3A', 'CS-3B', 'CS-4A', 'CS-4B',
    'IT-1A', 'IT-1B', 'IT-2A', 'IT-2B'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-3xl w-full mx-4 border border-white/50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-navy mb-6">
          {mode === 'create' ? 'Create New Assignment' : 'Edit Assignment'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter assignment title"
              required
            />
          </div>

          {/* Subject and Class */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Assignment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="homework">Homework</option>
                <option value="project">Project</option>
                <option value="lab">Lab Work</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Describe the assignment requirements..."
              required
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Additional Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Any specific instructions for students..."
            />
          </div>

          {/* Due Date and Marks */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Grade Weightage (%)
              </label>
              <input
                type="number"
                value={formData.gradeWeightage}
                onChange={(e) => setFormData({ ...formData, gradeWeightage: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-4 border border-white/50">
            <p className="text-sm font-medium text-navy mb-3">Additional Settings</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowLateSubmission}
                  onChange={(e) => setFormData({ ...formData, allowLateSubmission: e.target.checked })}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-400"
                />
                <span className="text-sm text-navy">Allow late submissions (with penalty)</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="text-sm text-navy">Expected Students:</label>
                <input
                  type="number"
                  value={formData.totalStudents}
                  onChange={(e) => setFormData({ ...formData, totalStudents: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/60 border border-white/50 rounded-lg text-navy text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50/30 rounded-xl p-3 border border-blue-200/50">
            <p className="text-xs text-navy/70">
              📌 Students will be notified about this assignment immediately after creation. 
              You can track submissions and grade them from the assignments dashboard.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              {mode === 'create' ? 'Create Assignment' : 'Update Assignment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/50 text-navy py-2 px-4 rounded-xl hover:bg-white/70 transition-all duration-300 font-semibold border border-white/50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}