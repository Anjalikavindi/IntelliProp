// src/utils/authUtils.js

// 1 hour in milliseconds
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

// Function to log out the user
export const logoutAdmin = (message = "Your session has expired due to inactivity.") => {
    // Clear all session storage items
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("lastActivityTime");
    
    // Use SweetAlert to inform the user (if SweetAlert is accessible globally, otherwise use a redirect)
    // Since this is a utility, we will rely on the component wrapping to show a nice alert,
    // but for immediate action, redirecting is the most robust step.
    
    // We can also store the message in sessionStorage to display it on the login page after redirect
    sessionStorage.setItem("sessionTimeoutMessage", message);
    
    // sessionStorage.setItem("logoutMessage", message);

    // Redirect to the login page
    window.location.href = "/admin/login";
};

// Function to reset the activity timer
export const resetActivityTimer = () => {
    // Store the current time
    localStorage.setItem("lastActivityTime", Date.now().toString());
};

// Function to check for inactivity
export const checkInactivity = () => {
    const lastActivityTime = localStorage.getItem("lastActivityTime");
    const adminToken = localStorage.getItem("adminToken");

    // Only check if a token exists and we have a last activity time
    if (adminToken && lastActivityTime) {
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - parseInt(lastActivityTime, 10);

        if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
            // If the timeout is exceeded, log out the user
            logoutAdmin("You have been automatically logged out due to 1 hour of inactivity.");
            return true; // Session expired
        }
    }
    
    return false; // Session is active
};