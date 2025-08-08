// components/AuthRequiredPopup.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Props {
    show: boolean;
    onClose: () => void;
    message?: string;
}

const AuthRequiredPopup: React.FC<Props> = ({ show, onClose, message }) => {
    if (!show) return null;

    return (
        <div className="text-center">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Access Restricted</h4>
            <p className="text-sm text-gray-500 mb-4">
                {message || "You must be signed in to access this feature."}
            </p>
            <Link
                to="/login"
                className="inline-block text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded-full shadow-sm"
                onClick={onClose}
            >
                Sign in →
            </Link>
        </div>
    );
};

export default AuthRequiredPopup;
