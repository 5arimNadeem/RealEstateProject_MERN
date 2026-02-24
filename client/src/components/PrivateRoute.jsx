import { useSelector } from 'react-redux';
// outlet is used to render the child routes in the parent route and navigate is used to redirect the user to the sign-in page if they are not logged in

/* 
    <Route element={<PrivateRoute />} > parent route
        <Route path='/profile' element={<Profile />} /> child route
    </Route>


    in the above code we have wrapped the profile route with the private route so that only when the user is logged in the profile page will be displayed otherwise it will redirect to the sign-in page and in the private route component we are checking if the currentUser is present in the state then we are rendering the child routes using outlet otherwise we are redirecting to the sign-in page using navigate


    ----explanation of the code and the d/f between the hook and the componenets 

    # Hooks vs Components - Quick Summary

## **What Are Components and Hooks?**

A **component** is a piece of UI that you can see and render on the screen - it returns JSX (visual elements) and you use it by writing it in angle brackets like `<Button />` or `<Navigate />`. Think of components as LEGO blocks that you place on your screen - they're the actual visual building blocks of your app. On the other hand, a **hook** is an invisible JavaScript function that gives your component special powers and capabilities - it returns data or functions (not visual elements) and you use it by calling it like a regular function: `useState()`, `useNavigate()`, `useSelector()`. Hooks always start with the word "use" and must be called at the top level of your component. The key difference: components are things you RENDER (you can see them), while hooks are functions you CALL (they're invisible logic that powers your components).

## **Navigate vs useNavigate**

`<Navigate />` is a **component** you render in your JSX for declarative, automatic redirects - it's perfect for route protection where you want to immediately redirect users if they're not logged in, like `return currentUser ? <Dashboard /> : <Navigate to="/sign-in" />`. It redirects the moment it renders on the screen. In contrast, `useNavigate()` is a **hook** that returns a navigation function you can call later in response to events - it's perfect for programmatic navigation after user actions like form submissions or button clicks, like `const navigate = useNavigate()` then `navigate('/dashboard')` inside a `handleLogin` function. Use `<Navigate />` when you want to redirect as part of your component's render logic (declarative style), and use `useNavigate()` when you need to navigate in response to events like API calls completing or buttons being clicked (imperative style). In your authentication system, you'd use `<Navigate />` to protect routes and `useNavigate()` to redirect users after they successfully log in or sign up.
*/
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
    // if the currentUser is present then render the child routes otherwise redirect to the sign-in page
    // child route is showed by the outlet component and navigate is used to redirect to the sign-in page
    return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}