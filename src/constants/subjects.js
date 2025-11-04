// Subject mappings: English API name -> Display label (Arabic/Hebrew)
export const subjectLabels = {
  'Arabic': 'عربي',
  'Hebrew': 'عبراني',
  'English': 'انجليزي',
  'Math': 'رياضيات',
  'History': 'تاريخ',
  'Religion': 'دين',
  'Geography': 'جغرافيا',
  'Physics': 'فيزيا',
  'Electronics': 'موخترونيكا',
  'Civics': 'مدنيات',
  'Chemistry': 'كيميا',
  'Biology': 'بيولوجيا',
  'Environment': 'بيئه',
  'Technology': 'تكنولوجيا',
  'Computer': 'حاسوب',
  'Science': 'علوم',
  'Adapted Teaching': 'הוראה מותאמת',
  'Architecture': 'אדריכלות',
  'Statistics': 'סטטיסטיקה'
}

// Reverse mapping: Display label -> English API name
export const labelToSubject = {
  'عربي': 'Arabic',
  'عبراني': 'Hebrew',
  'انجليزي': 'English',
  'رياضيات': 'Math',
  'تاريخ': 'History',
  'دين': 'دين',
  'جغرافيا': 'Geography',
  'فيزيا': 'Physics',
  'موخترونيكا': 'Electronics',
  'مدنيات': 'Civics',
  'كيميا': 'Chemistry',
  'بيولوجيا': 'Biology',
  'بيئه': 'Environment',
  'تكنولوجيا': 'Technology',
  'حاسوب': 'Computer',
  'علوم': 'Science',
  'הוראה מותאמת': 'Adapted Teaching',
  'אדריכלות': 'Architecture',
  'סטטיסטיקה': 'Statistics'
}

// Get all subjects as options for Select dropdown
// Returns options with Arabic/Hebrew labels for display
// but values are also labels (we convert to English when sending to API)
export const getSubjectOptions = () => {
  const options = Object.entries(subjectLabels)
    .map(([english, label]) => ({
      value: label, // Store Arabic/Hebrew label as value
      label: label  // Display Arabic/Hebrew label in dropdown
    }))
  
  // Sort by Arabic/Hebrew label alphabetically
  return options.sort((a, b) => {
    return a.label.localeCompare(b.label, ['ar', 'he'], { numeric: true })
  })
}

// Default prices
export const DEFAULT_INDIVIDUAL_PRICE = 50
export const DEFAULT_GROUP_PRICE = 50
