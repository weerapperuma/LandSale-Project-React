import React, { useState } from "react";
import { logout } from "../features/auth/authSlice.ts";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store.ts";
import { useNavigate } from "react-router-dom";
type User = {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
};

type Land = {
    id: string;
    title: string;
    owner: string;
    status: "Pending" | "Approved" | "Rejected";
};

const dummyUsers: User[] = [
    { id: "1", name: "Alice", email: "alice@mail.com", role: "USER" },
    { id: "2", name: "Bob", email: "bob@mail.com", role: "ADMIN" },
];

const dummyLands: Land[] = [
    { id: "101", title: "Beautiful Land", owner: "Alice", status: "Pending" },
    { id: "102", title: "Farm Land", owner: "Bob", status: "Approved" },
];

const AdminDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<
        "profile" | "users" | "lands" | "approvals"
    >("profile");

    const tabs: Array<{ id: "profile" | "users" | "lands" | "approvals"; label: string }> = [
        { id: "profile", label: "My Profile" },
        { id: "users", label: "Manage Users" },
        { id: "lands", label: "Manage Lands" },
        { id: "approvals", label: "Land Approvals" },
    ];

    // Mock logout handler
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    // Placeholder handlers for user actions
    const handleDeleteUser = (id: string) => alert(`Delete user ${id}`);
    const handleUpdateUser = (id: string) => alert(`Update user ${id}`);
    const handleAddUser = () => alert("Add new user");
    const handleDeleteLand = (id: string) => alert(`Delete land ${id}`);
    const handleApproveLand = (id: string) => alert(`Approve land ${id}`);
    const handleRejectLand = (id: string) => alert(`Reject land ${id}`);
    const handleUpdateProfile = () => alert("Update profile");

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    onClick={() => {
                        handleLogout();
                        console.log("Logout clicked");
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Warning Banner */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-6xl mx-auto my-6 rounded shadow-md">
                <p className="font-semibold">
                    ⚠️ WARNING: Actions performed here affect users and listings. Proceed
                    with caution!
                </p>
            </div>

            {/* Tabs */}
            <nav className="max-w-6xl mx-auto px-4 mb-8 flex gap-4">
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`px-4 py-2 rounded font-semibold transition ${
                            activeTab === id
                                ? "bg-red-700 text-white"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                        aria-current={activeTab === id ? "page" : undefined}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-4 pb-16">
                {activeTab === "profile" && (
                    <section className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>
                        <p>Name: Admin User</p>
                        <p>Email: admin@example.com</p>
                        {/* Replace with editable fields/form */}
                        <button
                            onClick={handleUpdateProfile}
                            className="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
                        >
                            Update Profile
                        </button>
                    </section>
                )}

                {activeTab === "users" && (
                    <section className="bg-white p-6 rounded shadow-md overflow-x-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Users Management</h2>
                            <button
                                onClick={handleAddUser}
                                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
                            >
                                Add User
                            </button>
                        </div>
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead className="bg-red-100 text-red-700">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Role</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dummyUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-red-50 transition-colors"
                                >
                                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleUpdateUser(user.id)}
                                            className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {activeTab === "lands" && (
                    <section className="bg-white p-6 rounded shadow-md overflow-x-auto">
                        <h2 className="text-2xl font-semibold mb-4">Land Management</h2>
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead className="bg-red-100 text-red-700">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Title</th>
                                <th className="border border-gray-300 px-4 py-2">Owner</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dummyLands.map((land) => (
                                <tr
                                    key={land.id}
                                    className="hover:bg-red-50 transition-colors"
                                >
                                    <td className="border border-gray-300 px-4 py-2">{land.title}</td>
                                    <td className="border border-gray-300 px-4 py-2">{land.owner}</td>
                                    <td className="border border-gray-300 px-4 py-2">{land.status}</td>
                                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleDeleteLand(land.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {activeTab === "approvals" && (
                    <section className="bg-white p-6 rounded shadow-md overflow-x-auto">
                        <h2 className="text-2xl font-semibold mb-4">Land Approval</h2>
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead className="bg-red-100 text-red-700">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Title</th>
                                <th className="border border-gray-300 px-4 py-2">Owner</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dummyLands
                                .filter((land) => land.status === "Pending")
                                .map((land) => (
                                    <tr
                                        key={land.id}
                                        className="hover:bg-red-50 transition-colors"
                                    >
                                        <td className="border border-gray-300 px-4 py-2">{land.title}</td>
                                        <td className="border border-gray-300 px-4 py-2">{land.owner}</td>
                                        <td className="border border-gray-300 px-4 py-2">{land.status}</td>
                                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => handleApproveLand(land.id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectLand(land.id)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
