import { createContext, useContext, useState } from 'react'

const AddStudentContext = createContext()

export const AddStudentProvider = ({ children }) => {
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)

  return (
    <AddStudentContext.Provider value={{ showAddStudentModal, setShowAddStudentModal }}>
      {children}
    </AddStudentContext.Provider>
  )
}

export const useAddStudent = () => {
  const context = useContext(AddStudentContext)
  // Return default values if context is not available (shouldn't happen but makes it safer)
  if (!context) {
    return { showAddStudentModal: false, setShowAddStudentModal: () => {} }
  }
  return context
}

