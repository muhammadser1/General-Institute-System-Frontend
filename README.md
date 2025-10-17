# General Institute System - Frontend

A modern, responsive React application for managing an educational institute with separate views for teachers and administrators.

## 🚀 Features

- **Authentication System**: Login, Signup, and protected routes
- **Teacher Dashboard**: Manage lessons, view statistics, and track progress
- **Admin Panel**: User management, earnings tracking, payment processing, and pricing management
- **Responsive Design**: Separate desktop and mobile components for optimal user experience
- **Modern UI**: Clean, professional interface with smooth animations
- **API Integration**: Complete integration with the backend API

## 📁 Project Structure

```
General-Institute-System-Frontend/
├── public/
│   ├── images/          # Images (logo, icons, banners)
│   └── icons/           # Icon files
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Common UI components (Button, Card, Modal, etc.)
│   │   └── layout/      # Layout components (Header, Sidebar, Footer)
│   ├── contexts/        # React Context providers
│   │   └── AuthContext.jsx
│   ├── hooks/           # Custom React hooks
│   │   └── useMediaQuery.js
│   ├── layouts/         # Page layouts
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages (desktop & mobile)
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── lessons/     # Lesson management pages
│   │   ├── profile/     # Profile pages
│   │   └── public/      # Public pages
│   ├── routes/          # Route configuration
│   │   └── AppRoutes.jsx
│   ├── services/        # API service layer
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── lessonService.js
│   │   ├── adminService.js
│   │   ├── paymentService.js
│   │   └── pricingService.js
│   ├── styles/          # CSS styles
│   │   ├── components/  # Component styles
│   │   ├── layouts/     # Layout styles
│   │   └── pages/       # Page styles
│   ├── utils/           # Utility functions
│   │   └── helpers.js
│   ├── constants/       # Constants and configuration
│   │   └── config.js
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Application entry point
├── .eslintrc.json       # ESLint configuration
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Tech Stack

- **React 18**: UI library
- **React Router DOM**: Routing
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **CSS3**: Styling with CSS variables
- **ESLint**: Code linting

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📱 Responsive Design

The application uses a mobile-first approach with separate components for desktop and mobile views:

- **Desktop**: Components suffixed with `_desktop.jsx`
- **Mobile**: Components suffixed with `_mobile.jsx`

The `useMediaQuery` hook automatically detects the device and renders the appropriate component.

## 🎨 Styling

The project uses CSS with CSS variables for theming:

- **Colors**: Defined in `src/styles/index.css`
- **Spacing**: Consistent spacing scale
- **Responsive**: Mobile breakpoint at 768px

## 🔐 Authentication

The app uses JWT tokens for authentication:
- Token stored in `localStorage`
- Auto-redirect to login on 401 errors
- Protected routes for authenticated users
- Role-based access control (Teacher/Admin)

## 📄 API Integration

All API calls are centralized in the `services` folder:

- **authService**: Authentication endpoints
- **lessonService**: Lesson management
- **adminService**: Admin operations
- **paymentService**: Payment tracking
- **pricingService**: Pricing management

## 🧩 Components

### Common Components
- `Button`: Reusable button with variants
- `Card`: Content container
- `Modal`: Dialog component
- `Input`: Form input field
- `Select`: Dropdown selector
- `Table`: Data table
- `Badge`: Status badge
- `Alert`: Notification message
- `Loading`: Loading spinner

### Layout Components
- `Header`: Navigation header (desktop & mobile)
- `Sidebar`: Side navigation (desktop only)
- `Footer`: Page footer

## 📝 Pages

### Public Pages
- `HomePage`: Landing page
- `PricingPublicPage`: Public pricing information

### Authentication
- `LoginPage`: User login
- `SignupPage`: Teacher registration

### Teacher Pages
- `DashboardPage`: Teacher dashboard
- `LessonsPage`: Lesson list
- `LessonDetailPage`: Lesson details
- `CreateLessonPage`: Create new lesson
- `ProfilePage`: User profile

### Admin Pages
- `AdminDashboardPage`: Admin dashboard
- `UsersManagementPage`: Manage users
- `TeacherEarningsPage`: Earnings reports
- `PaymentsPage`: Payment tracking
- `PricingPage`: Pricing management

## 🔧 Configuration

### API Base URL
Update the API base URL in:
- `.env` file for environment-specific URLs
- `src/constants/config.js` for default URL

### Constants
Edit `src/constants/config.js` to customize:
- Subjects list
- Lesson types
- User roles
- Duration options
- Grades list

## 📱 Mobile Responsiveness

All pages have separate desktop and mobile implementations:
- Automatic detection using `useMediaQuery` hook
- Mobile-optimized layouts
- Touch-friendly interactions
- Collapsible navigation

## 🎯 Next Steps

1. Add images to `public/images/`
2. Implement page components (currently empty)
3. Connect forms to API services
4. Add error handling and validation
5. Implement loading states
6. Add animations and transitions
7. Test on multiple devices
8. Deploy to production

## 📚 API Documentation

See `API_FRONTEND_REFERENCE.md` for complete API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

## 👥 Authors

General Institute System Team

---

**Status**: Setup Complete - Ready for Development 🎉