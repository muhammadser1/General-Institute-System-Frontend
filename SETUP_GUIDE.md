# Setup Guide - General Institute System Frontend

## ✅ Project Setup Complete!

Your React project has been successfully set up with a professional structure. Here's what has been created:

## 📦 What's Included

### ✅ Core Configuration
- ✅ Vite build tool configured
- ✅ React 18 with React Router
- ✅ ESLint for code quality
- ✅ Axios for API calls
- ✅ CSS with CSS variables for theming

### ✅ Folder Structure
```
src/
├── components/
│   ├── common/          # 9 reusable UI components
│   └── layout/          # Header, Sidebar, Footer
├── contexts/            # AuthContext for state management
├── hooks/               # useMediaQuery for responsive design
├── layouts/             # MainLayout & AuthLayout
├── pages/               # All pages (empty, ready for implementation)
│   ├── admin/          # 5 admin pages (desktop & mobile)
│   ├── auth/           # Login & Signup pages
│   ├── dashboard/      # Dashboard page
│   ├── lessons/        # 3 lesson pages
│   ├── profile/        # Profile page
│   └── public/         # Home & Pricing pages
├── routes/             # AppRoutes with protected routes
├── services/           # 6 API service files
├── styles/             # Organized CSS files
├── utils/              # Helper functions
└── constants/          # Configuration constants
```

### ✅ Features Implemented
- ✅ Authentication system with JWT
- ✅ Protected routes (Teacher & Admin)
- ✅ Responsive design (Desktop & Mobile)
- ✅ API service layer
- ✅ Common UI components
- ✅ Layout system
- ✅ Error handling
- ✅ Loading states

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env` file in the root:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📝 Next Steps - Implementation Order

### Phase 1: Authentication (Start Here!)
1. **Login Page** (`src/pages/auth/LoginPageDesktop.jsx`)
   - Create login form
   - Integrate with `authService.login()`
   - Handle errors and loading states

2. **Signup Page** (`src/pages/auth/SignupPageDesktop.jsx`)
   - Create registration form
   - Integrate with `authService.signup()`
   - Add validation

### Phase 2: Teacher Features
3. **Dashboard** (`src/pages/dashboard/DashboardPageDesktop.jsx`)
   - Display statistics
   - Show recent lessons
   - Quick actions

4. **Lessons List** (`src/pages/lessons/LessonsPageDesktop.jsx`)
   - Fetch lessons with `lessonService.getMyLessons()`
   - Add filters
   - Display lesson cards

5. **Create Lesson** (`src/pages/lessons/CreateLessonPageDesktop.jsx`)
   - Build lesson form
   - Add student input
   - Submit with `lessonService.submitLesson()`

6. **Lesson Detail** (`src/pages/lessons/LessonDetailPageDesktop.jsx`)
   - Fetch lesson details
   - Show lesson info
   - Edit/Delete actions

### Phase 3: Admin Features
7. **Admin Dashboard** (`src/pages/admin/AdminDashboardPageDesktop.jsx`)
   - Overall statistics
   - Recent activities
   - Quick links

8. **User Management** (`src/pages/admin/UsersManagementPageDesktop.jsx`)
   - List users
   - Create/Edit/Delete users
   - Filter by role/status

9. **Payments** (`src/pages/admin/PaymentsPageDesktop.jsx`)
   - Create payment records
   - View monthly payments
   - Filter by student

10. **Pricing Management** (`src/pages/admin/PricingPageDesktop.jsx`)
    - Manage subject prices
    - Create/Edit/Delete pricing
    - Set default prices

11. **Teacher Earnings** (`src/pages/admin/TeacherEarningsPageDesktop.jsx`)
    - Select teacher
    - View earnings by month
    - Breakdown by subject

### Phase 4: Public Pages
12. **Home Page** (`src/pages/public/HomePageDesktop.jsx`)
    - Hero section
    - Features
    - Call to action

13. **Public Pricing** (`src/pages/public/PricingPublicPageDesktop.jsx`)
    - Display pricing
    - No authentication required

### Phase 5: Mobile Versions
14. Implement all `*Mobile.jsx` components
    - Copy logic from desktop versions
    - Adjust layout for mobile
    - Test on mobile devices

## 🎨 Styling Guidelines

### Using CSS Variables
All colors and spacing are defined in `src/styles/index.css`:

```css
/* Colors */
color: var(--primary-color);
background: var(--bg-primary);

/* Spacing */
padding: var(--spacing-md);
margin: var(--spacing-lg);

/* Border Radius */
border-radius: var(--radius-md);

/* Shadows */
box-shadow: var(--shadow-md);
```

### Responsive Design
- Desktop: Default styles
- Mobile: Use `@media (max-width: 768px)`

### Component Structure
```jsx
import './ComponentName.css'

const ComponentName = () => {
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  )
}

export default ComponentName
```

## 🔧 Common Patterns

### API Calls
```javascript
import { lessonService } from '../../services/lessonService'
import { useState, useEffect } from 'react'

const MyComponent = () => {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true)
        const data = await lessonService.getMyLessons()
        setLessons(data.lessons)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [])

  if (loading) return <Loading />
  if (error) return <Alert type="danger" message={error} />

  return (
    <div>
      {lessons.map(lesson => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  )
}
```

### Form Handling
```javascript
import { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const MyForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    duration: 60
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await lessonService.submitLesson(formData)
      // Success!
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        required
      />
      <Button type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  )
}
```

### Using Common Components
```javascript
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import Alert from '../../components/common/Alert'

// Usage
<Card>
  <div className="card-header">
    <h3 className="card-title">Title</h3>
  </div>
  <div className="card-body">
    <Badge variant="success">Active</Badge>
  </div>
  <div className="card-footer">
    <Button variant="primary">Action</Button>
  </div>
</Card>
```

## 📱 Mobile Implementation

Each page has two versions:
1. **Desktop**: `PageNameDesktop.jsx`
2. **Mobile**: `PageNameMobile.jsx`

The main page component automatically selects the right version:

```javascript
import { useIsMobile } from '../../hooks/useMediaQuery'
import PageDesktop from './PageDesktop'
import PageMobile from './PageMobile'

const Page = () => {
  const isMobile = useIsMobile()
  return isMobile ? <PageMobile /> : <PageDesktop />
}
```

## 🎯 Tips for Implementation

1. **Start Simple**: Implement basic functionality first, add polish later
2. **Reuse Components**: Use common components from `components/common/`
3. **Follow Patterns**: Look at existing code for consistency
4. **Test Often**: Test after each feature
5. **Mobile First**: Consider mobile layout from the start
6. **Error Handling**: Always handle errors gracefully
7. **Loading States**: Show loading indicators for async operations
8. **Validation**: Validate forms before submission

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### API Connection Issues
- Check `.env` file has correct API URL
- Ensure backend is running
- Check CORS settings

## 📚 Resources

- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **Vite**: https://vitejs.dev
- **Axios**: https://axios-http.com
- **API Reference**: See `API_FRONTEND_REFERENCE.md`

## ✨ Ready to Code!

Your project is fully set up and ready for development. Start with the authentication pages and work through the phases systematically.

Good luck! 🚀
