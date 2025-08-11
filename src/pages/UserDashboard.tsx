import React, { useEffect, useState } from "react";
import { logout } from "../features/auth/authSlice.ts";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store.ts";
import { useNavigate } from "react-router-dom";
import UpdateUserForm from "../components/UpdateUserForm.tsx";

type User = {
    _id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    role: "ADMIN" | "USER";
};

const UserDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        if (!userId || !token) {
            setError("Not authenticated");
            return;
        }

        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:5000/api/v1/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Fetch failed");

                const data = await res.json();
                console.log("API response:", data);

                // Adjust this line according to your backend response structure
                setUser(data.data || data);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, token]);

    const handleDeleteProfile = async () => {
        if (!userId || !token) return;

        if (
            !window.confirm(
                "Are you sure you want to delete your profile? This action is irreversible."
            )
        ) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/v1/user/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (res.ok) {
                alert("Profile deleted successfully.");
                dispatch(logout());
                navigate("/");
            } else {
                alert("Failed to delete profile: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            alert("Error deleting profile: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    const onUpdateSuccess = (updatedUser: User) => {
        console.log("Updated user:", updatedUser);
        setUser(updatedUser);
        setShowUpdateForm(false);
    };

    console.log("Loading:", loading);
    console.log("Error:", error);
    console.log("User:", user);
    console.log("Show update form:", showUpdateForm);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-lg mx-auto bg-white p-8 rounded shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

                {loading && <p>Loading user data...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {user && !showUpdateForm && (
                    <div className="space-y-4">
                        <div>
                            <strong>Name:</strong> <span>{user.name}</span>
                        </div>
                        <div>
                            <strong>Email:</strong> <span>{user.email}</span>
                        </div>
                        <div>
                            <strong>Address:</strong> <span>{user.address}</span>
                        </div>
                        <div>
                            <strong>Phone:</strong> <span>{user.phoneNumber}</span>
                        </div>
                        <div>
                            <strong>Role:</strong> <span>{user.role}</span>
                        </div>

                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={() => setShowUpdateForm(true)}
                                className="bg-yellow-400 text-yellow-900 px-5 py-2 rounded hover:bg-yellow-500 transition"
                            >
                                Update Profile
                            </button>
                            <button
                                onClick={handleDeleteProfile}
                                className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
                            >
                                Delete Profile
                            </button>
                        </div>
                    </div>
                )}

                {showUpdateForm && user && token && (
                    <UpdateUserForm
                        user={user}
                        token={token}
                        onClose={() => setShowUpdateForm(false)}
                        onUpdate={onUpdateSuccess}
                        isAdminEdit={false}
                    />
                )}

                {!loading && !error && !user && <p>No user data available.</p>}
            </div>
        </div>
    );
};

export default UserDashboard;
