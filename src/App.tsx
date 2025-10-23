import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/layouts/public-layout";
import AuthenticationLayout from "@/layouts/auth-layout";
import { ProtectedRoutes } from "@/layouts/protected-routes";
import { MainLayout } from "@/layouts/main-layout";

// Page Components
import HomePage from "@/routes/home";
import { SignInPage } from "./routes/sign-in";
import { SignUpPage } from "./routes/sign-up";
import { ForgotPasswordPage } from "./routes/forgot-password";
import { ResetPasswordPage } from "./routes/reset-password";
import { Generate } from "./components/generate";
import { Dashboard } from "@/routes/dashboard";
import { CreateEditPage } from "./routes/create-edit-page";
import { MockLoadPage } from "./routes/mock-load-page";
import { MockInterviewPage } from "./routes/mock-interview-page";
import { Feedback } from "./routes/feedback";
import AboutPage from "@/routes/about";
import ContactPage from "@/routes/contact";
import ServicesPage from "@/routes/services";
import UploadPage from "@/routes/upload";
import ResumePage from "@/routes/resume";

import FormMockInterview from './components/form-mock-interview';
import { Toaster } from 'sonner';

const App = () => {
  // All Supabase connection checks and state have been removed.
  // This component is now only responsible for routing.

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/resume/:id" element={<ResumePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services/*" element={<ServicesPage />} />
        </Route>

        {/* Authentication routes */}
        <Route element={<AuthenticationLayout />}>
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Navigate to="/generate" replace />} />
            
            <Route element={<Generate />} path="/generate">
              <Route index element={<Dashboard />} />
              <Route path="create" element={<CreateEditPage />} />
              <Route path="edit/:id" element={<CreateEditPage />} />
              {/* This route seems redundant, but kept it in case it's needed */}
              <Route path=":id" element={<CreateEditPage />} /> 
              <Route path="interview/:id" element={<MockLoadPage />} />
              <Route path="interview/:id/start" element={<MockInterviewPage />} />
              <Route path="feedback/:id" element={<Feedback />} />
              
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;