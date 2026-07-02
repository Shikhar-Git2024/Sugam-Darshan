import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "../pages/public/HomePage";
import FeaturesPage from "../pages/public/FeaturesPage";
import DevoteeLoginPage from "../pages/devotee/DevoteeLoginPage";
import DevoteeRegisterPage from "../pages/devotee/DevoteeRegisterPage";
import ForgotPasswordPage from "../pages/devotee/ForgotPasswordPage";
import DevoteeDashboard from "../pages/devotee/DevoteeDashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RecommendationPage from "../pages/devotee/RecommendationPage";
import BookingPage from "../pages/devotee/BookingPage";
import BookingSuccessPage from "../pages/devotee/BookingSuccessPage";
import MyBookingsPage from "../pages/devotee/MyBookingsPage";
import BookingDetailsPage from "../pages/devotee/BookingDetailsPage";
import CrowdIntelligencePage from "../pages/devotee/CrowdIntelligencePage";
import TempleNavigationPage from "../pages/devotee/TempleNavigationPage";
import LiveCrowdMapPage from "../pages/devotee/LiveCrowdMapPage";
import WeatherTravelPage from "../pages/devotee/WeatherTravelPage";
import SpiritualGuidePage from "../pages/devotee/SpiritualGuidePage";
import FestivalCalendarPage from "../pages/devotee/FestivalCalendarPage";
import EmergencySOSPage from "../pages/devotee/EmergencySOSPage";
import MissingPersonPage from "../pages/devotee/MissingPersonPage";
import NotificationsPage from "../pages/devotee/NotificationsPage";
import ProfileSettingsPage from "../pages/devotee/ProfileSettingsPage";
import AuthorityRoute from "../components/auth/AuthorityRoute";
import AuthorityLoginPage from "../pages/authority/AuthorityLoginPage";
import AuthorityDashboard from "../pages/authority/AuthorityDashboard";
import LiveCrowdMonitoringPage from "../pages/authority/LiveCrowdMonitoringPage";
import BookingManagementPage from "../pages/authority/BookingManagementPage";
import DevoteeManagementPage from "../pages/authority/DevoteeManagementPage";
import WaitlistManagementPage from "../pages/authority/WaitlistManagementPage";
import RiskAnalysisPage from "../pages/authority/RiskAnalysisPage";
import IncidentManagementPage from "../pages/authority/IncidentManagementPage";
import NotificationBroadcastPage from "../pages/authority/NotificationBroadcastPage";
import AdminRoute from "../components/auth/AdminRoute";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AuthorityManagementPage from "../pages/admin/AuthorityManagementPage";
import DevoteeResetPassword from "../pages/devotee/DevoteeResetPassword";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Pages */}
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/features"
          element={<FeaturesPage />}
        />

        {/* Devotee Authentication System */}
        <Route
          path="/devotee/login"
          element={<DevoteeLoginPage />}
        />
        <Route
          path="/devotee/register"
          element={<DevoteeRegisterPage />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/reset-password/:token"
          element={<DevoteeResetPassword />}
        />
        {/* Secured Internal Dashboards */}
        <Route
          path="/devotee/dashboard"
          element={
            <ProtectedRoute>
              <DevoteeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/planner"
          element={
            <ProtectedRoute>
              <RecommendationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/booking-success"
          element={
            <ProtectedRoute>
              <BookingSuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/booking-details/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/crowd-intelligence"
          element={
          <ProtectedRoute>
              <CrowdIntelligencePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/devotee/navigation"
          element={
          <ProtectedRoute>
              <TempleNavigationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/live-map"
          element={
            <ProtectedRoute>
              <LiveCrowdMapPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/weather-travel"
          element={
            <ProtectedRoute>
              <WeatherTravelPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/spiritual-companion"
          element={
            <ProtectedRoute>
              <SpiritualGuidePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/festival-calendar"
          element={
            <ProtectedRoute>
              <FestivalCalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/emergency-sos"
          element={
            <ProtectedRoute>
              <EmergencySOSPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/missing-person"
          element={
            <ProtectedRoute>
              <MissingPersonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devotee/profile"
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/authority/login"
          element={
              <AuthorityLoginPage />
          }
        />

        <Route
          path="/authority/dashboard"
          element={
              <AuthorityRoute>
                <AuthorityDashboard />
              </AuthorityRoute>
          }
        />

        <Route
          path="/authority/live-crowd-monitoring"
          element={
              <AuthorityRoute>
                <LiveCrowdMonitoringPage />
              </AuthorityRoute>
          }
        />

        <Route
          path="/authority/bookings"
          element={
              <AuthorityRoute>
                <BookingManagementPage />
              </AuthorityRoute>
          }
        />

        <Route
          path="/authority/devotees"
          element={
              <AuthorityRoute>
                <DevoteeManagementPage />
              </AuthorityRoute>
          }
        />

        <Route
          path="/authority/waitlist"
          element={
              <AuthorityRoute>
                <WaitlistManagementPage />
              </AuthorityRoute>
          }
        />

        <Route
          path="/authority/risk-analysis"
          element={
              <AuthorityRoute>
                <RiskAnalysisPage />
              </AuthorityRoute>
          }
        />

        <Route
          path="/authority/sos"
          element={
              <AuthorityRoute>
                <IncidentManagementPage />
              </AuthorityRoute>
          }
        />

        <Route
          path="/authority/notifications"
          element={
              <AuthorityRoute>
                <NotificationBroadcastPage />
              </AuthorityRoute>
          }
        />

        <Route
          path="/admin/login"
          element={
              <AdminLoginPage />
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/authority-management"
          element={
            <AdminRoute>
              <AuthorityManagementPage />
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}