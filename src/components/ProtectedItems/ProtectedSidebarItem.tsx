import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User } from "@/types";



interface ProtectedSidebarItemProps {
    path: string;
    iconActive: React.ReactNode;
    iconInactive: React.ReactNode;
    label: string;
    user: User; // Replace with actual user type if available
}

const ProtectedSidebarItem = ({ path, iconActive, iconInactive, label, user }: ProtectedSidebarItemProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    const handleNavigation = (pageName: string) => {
        if (typeof user === "undefined") return; // Ensure user check runs first
        if (!user) {
            setShowDialog(true); // Only show dialog if user doesn't exist
        } else {
            document.title = `ArtShare - ${pageName}`
            navigate(path);
        }
    };

    return (
        <>
            {/* Login Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <div
                    className="group flex flex-col justify-center items-center w-full h-16 hover:cursor-pointer"
                    onClick={() => handleNavigation(label)}
                >
                    <div
                        className={`flex justify-center items-center dark:group-hover:bg-mountain-800 group-hover:bg-mountain-100 rounded-lg w-[80%] h-8 ${location.pathname === path
                            ? "dark:text-mountain-50 text-mountain-950 bg-mountain-100 dark:bg-mountain-800"
                            : "dark:text-mountain-600 text-mountain-400"
                            } dark:group-hover:text-mountain-50 group-hover:text-mountain-950`}
                    >
                        {location.pathname === path ? iconActive : iconInactive}
                    </div>
                    <p
                        className={`${location.pathname === path
                            ? "dark:text-mountain-50"
                            : "text-mountain-600 dark:text-mountain-500"
                            } text-[10px] dark:group-hover:text-mountain-50`}
                    >
                        {label}
                    </p>
                </div>
                <DialogContent className="flex flex-col dark:bg-mountain-900 w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-mountain-950 dark:text-mountain-50">Oops! You’re Not Logged In</DialogTitle>
                        <DialogDescription>
                            You need to be logged in to access this feature. Please sign in or create an account to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-2 w-full">
                        <Link
                            to="/login"
                            className="flex justify-center items-center bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 hover:brightness-110 rounded-lg w-full h-9 text-white"
                        >
                            <p>Login</p>
                        </Link>
                        <Link
                            to="/signup"
                            className="flex justify-center items-center hover:bg-mountain-50 dark:bg-mountain-800 dark:hover:bg-mountain-700 shadow border border-mountain-100 dark:border-mountain-800 rounded-lg w-full h-9 text-mountain-900 dark:text-mountain-100"
                        >
                            <p>Sign Up</p>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProtectedSidebarItem;
