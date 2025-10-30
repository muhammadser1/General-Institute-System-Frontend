import { useState, useEffect } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import StudentsManagementPageDesktop from './StudentsManagementPageDesktop'
import StudentsManagementPageMobile from './StudentsManagementPageMobile'

const StudentsManagementPage = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return isMobile ? <StudentsManagementPageMobile /> : <StudentsManagementPageDesktop />
}

export default StudentsManagementPage

