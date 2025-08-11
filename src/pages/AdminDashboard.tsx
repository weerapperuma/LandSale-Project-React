import React, {useEffect, useState} from "react";
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
    role: "ADMIN" | "USER";
    phoneNumber: string;
    createdAt?: string;
};

type Land = {
    id: string;
    title: string;
    description: string;
    district: string;
    city: string;
    price: number;
    size: number;
    images: string[];
    isApproved: boolean;
    createdAt?: string;
    userId: string;
};

const AdminDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [id, setId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        "profile" | "users" | "lands" | "approvals"
    >("profile");

    const tabs: Array<{ id: "profile" | "users" | "lands" | "approvals"; label: string }> = [
        { id: "profile", label: "My Profile" },
        { id: "users", label: "Manage Users" },
        { id: "lands", label: "Manage Lands" },
        { id: "approvals", label: "Land Approvals" },
    ];
    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) setId(storedId);
    }, []);

    // Mock logout handler
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    // Placeholder handlers for user actions
    const handleDeleteLand = (id: string) => alert(`Delete land ${id}`);
    const handleApproveLand = (id: string) => alert(`Approve land ${id}`);
    const handleRejectLand = (id: string) => alert(`Reject land ${id}`);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [lands, setLands] = useState<Land[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingLands, setLoadingLands] = useState(false);
    const [errorUsers, setErrorUsers] = useState<string | null>(null);
    const [errorLands, setErrorLands] = useState<string | null>(null);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const token = localStorage.getItem("token") || "";

    const handleUpdateUserClick = (user?: User | null) => {
        // If a user is provided, use that, otherwise use currentUser if it's not null
        const userToUpdate = user || (currentUser ? currentUser : undefined);
        if (userToUpdate) {
            setSelectedUser(userToUpdate);
            setShowUpdateForm(true);
        }
    };

    // Function to fetch users - extracted so it can be reused
    const fetchUsers = async () => {
        setLoadingUsers(true);
        setErrorUsers(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const res = await fetch("http://localhost:5000/api/v1/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch users");

            const data = await res.json();

            const validUsers = Array.isArray(data.data)
                ? data.data.filter((user: User) => user && user._id)
                : [];

            setUsers(validUsers);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorUsers(err.message);
            } else {
                setErrorUsers("Failed to fetch users");
            }
        } finally {
            setLoadingUsers(false);
        }
    };

    // Updated handleUserUpdated function to refresh data from server
    const handleUserUpdated = async (updatedUser: User) => {

        // Refresh the users table by fetching fresh data from the server
        try {
            await fetchUsers();
            setShowUpdateForm(false);
        } catch (error) {
            console.error("Failed to refresh users table:", error);
            // Fallback to local state update if fetch fails
            setUsers((prevUsers: User[]) => {
                const newUsers = prevUsers.map((user: User) => {
                    if (!user || !user._id) {
                        console.warn("Invalid user in array:", user);
                        return user;
                    }
                    return user._id === updatedUser._id ? updatedUser : user;
                });
                console.log("Updated users array (fallback):", newUsers);
                return newUsers;
            });
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:5000/api/v1/user/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                console.log("✅ Deleted:", data);
                // Remove the deleted user from the state
                setUsers((prevUsers: User[]) => prevUsers.filter((user: User) => user._id !== id));
            } else {
                console.error("❌ Delete failed:", data);
                alert("Failed to delete user: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Error deleting user: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    useEffect(() => {
        // Load current user when component mounts
        const loadCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token || !id) return;

                const res = await fetch(`http://localhost:5000/api/v1/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch current user");

                const data = await res.json();
                setCurrentUser(data);
                console.log("in current user data: ",data)
            } catch (err) {
                console.error("Failed to load current user:", err);
            }
        };

        loadCurrentUser();
    }, [id]);

    // Fetch users when activeTab === "users":
    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers();
        }
    }, [activeTab]);

    //Fetch lands when activeTab === "lands"
    useEffect(() => {
        const fetchLands = async () => {
            setLoadingLands(true);
            setErrorLands(null);
            try {
                const res = await fetch("http://localhost:5000/api/v1/lands");
                if (!res.ok) throw new Error("Failed to fetch lands");

                const data = await res.json();
                setLands(data.data); // Adjust if needed
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setErrorLands(err.message);
                } else {
                    setErrorLands("Failed to fetch lands");
                }
            } finally {
                setLoadingLands(false);
            }
        };

        if (activeTab === "lands" || activeTab === "approvals") {
            fetchLands();
        }
    }, [activeTab]);

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
                        <p>Id: {id}</p>
                        <p>Name: {currentUser?.name}</p>
                        <p>Email : {currentUser?.email}</p>
                        <p>Phone : {currentUser?.phoneNumber}</p>
                        <p>Address : {currentUser?.address}</p>
                        <p>Role: {currentUser?.role}</p>
                        {/* Replace with editable fields/form */}
                        <button
                            onClick={() => handleUpdateUserClick(currentUser)}
                            className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition inline-block"
                            style={{ whiteSpace: "nowrap" }}
                        >
                            Update
                        </button>

                        {showUpdateForm && selectedUser && (
                            <UpdateUserForm
                                user={selectedUser}
                                token={token}
                                onClose={() => setShowUpdateForm(false)}
                                onUpdate={handleUserUpdated}
                                isAdminEdit={true}
                            />
                        )}

                    </section>
                )}

                {activeTab === "users" && (
                    <section className="bg-white p-6 rounded shadow-md overflow-x-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Users Management</h2>
                            <button
                                onClick={fetchUsers}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                disabled={loadingUsers}
                            >
                                {loadingUsers ? "Refreshing..." : "Refresh Table"}
                            </button>
                        </div>

                        {loadingUsers && <p>Loading users...</p>}
                        {errorUsers && <p className="text-red-600">{errorUsers}</p>}

                        {!loadingUsers && !errorUsers && users.length === 0 && (
                            <p>No users found.</p>
                        )}

                        {!loadingUsers && !errorUsers && users.length > 0 && (
                            <>
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead className="bg-red-100 text-red-700">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Email</th>
                                        <th className="border border-gray-300 px-4 py-2">Address</th>
                                        <th className="border border-gray-300 px-4 py-2">Phone</th>
                                        <th className="border border-gray-300 px-4 py-2">Role</th>
                                        <th className="border border-gray-300 px-4 py-2">Created At</th>
                                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user: User) => {
                                        // Add safety check here too
                                        if (!user || !user._id) {
                                            console.warn("Skipping invalid user:", user);
                                            return null;
                                        }

                                        return (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-red-50 transition-colors"
                                            >
                                                <td className="border border-gray-300 px-4 py-2">{user.name || '-'}</td>
                                                <td className="border border-gray-300 px-4 py-2">{user.email || '-'}</td>
                                                <td className="border border-gray-300 px-4 py-2">{user.address || '-'}</td>
                                                <td className="border border-gray-300 px-4 py-2">{user.phoneNumber || '-'}</td>
                                                <td className="border border-gray-300 px-4 py-2">{user.role || '-'}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {user.createdAt
                                                        ? new Date(user.createdAt).toLocaleDateString()
                                                        : "-"}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateUserClick(user)}
                                                        className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition inline-block"
                                                        style={{ whiteSpace: "nowrap" }}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition inline-block"
                                                        style={{ whiteSpace: "nowrap" }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>

                                {/* Update user popup */}
                                {showUpdateForm && selectedUser && (
                                    <UpdateUserForm
                                        user={selectedUser}
                                        token={token}
                                        onClose={() => setShowUpdateForm(false)}
                                        onUpdate={handleUserUpdated}
                                        isAdminEdit={true}
                                    />
                                )}
                            </>
                        )}
                    </section>
                )}

                {activeTab === "lands" && (
                    <section className="bg-white p-6 rounded shadow-md overflow-x-auto">
                        <h2 className="text-2xl font-semibold mb-4">Land Management</h2>

                        {loadingLands && <p>Loading lands...</p>}
                        {errorLands && <p className="text-red-600">{errorLands}</p>}

                        {!loadingLands && !errorLands && lands.length === 0 && (
                            <p>No lands found.</p>
                        )}

                        {!loadingLands && !errorLands && lands.length > 0 && (
                            <table className="w-full table-auto border-collapse border border-gray-300">
                                <thead className="bg-red-100 text-red-700">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Title</th>
                                    <th className="border border-gray-300 px-4 py-2">Description</th>
                                    <th className="border border-gray-300 px-4 py-2">District</th>
                                    <th className="border border-gray-300 px-4 py-2">City</th>
                                    <th className="border border-gray-300 px-4 py-2">Price (LKR)</th>
                                    <th className="border border-gray-300 px-4 py-2">Size (acres)</th>
                                    <th className="border border-gray-300 px-4 py-2">Images</th>
                                    <th className="border border-gray-300 px-4 py-2">Approved</th>
                                    <th className="border border-gray-300 px-4 py-2">Created At</th>
                                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {lands.map((land: Land) => (
                                    <tr
                                        key={land.id || land.id}
                                        className="hover:bg-red-50 transition-colors"
                                    >
                                        <td className="border border-gray-300 px-4 py-2">{land.title}</td>
                                        <td className="border border-gray-300 px-4 py-2 truncate max-w-xs" title={land.description}>
                                            {land.description.length > 50 ? land.description.slice(0, 50) + "..." : land.description}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{land.district}</td>
                                        <td className="border border-gray-300 px-4 py-2">{land.city}</td>
                                        <td className="border border-gray-300 px-4 py-2">{land.price.toLocaleString()}</td>
                                        <td className="border border-gray-300 px-4 py-2">{land.size}</td>
                                        <td className="border border-gray-300 px-4 py-2">{land.images.length}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {land.isApproved ? (
                                                <span className="text-green-600 font-semibold">Yes</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">No</span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {land.createdAt
                                                ? new Date(land.createdAt).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => handleDeleteLand(land.id || land.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                            {/* You can add update or approve buttons here as needed */}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

                {activeTab === "approvals" && (
                    <section className="bg-white p-6 rounded shadow-md overflow-x-auto">
                        <h2 className="text-2xl font-semibold mb-4">Land Approval</h2>
                        {loadingLands && <p>Loading lands...</p>}
                        {errorLands && <p className="text-red-600">{errorLands}</p>}

                        {!loadingLands && !errorLands && (
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
                                {lands
                                    .filter(land => !land.isApproved)
                                    .map(land => (
                                        <tr
                                            key={land.id}
                                            className="hover:bg-red-50 transition-colors"
                                        >
                                            <td className="border border-gray-300 px-4 py-2">{land.title}</td>
                                            <td className="border border-gray-300 px-4 py-2">{land.userId}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <span className="text-yellow-600 font-semibold">Pending</span>
                                            </td>
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
                        )}
                        {!loadingLands && lands.filter(land => !land.isApproved).length === 0 && (
                            <p>No lands pending approval</p>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;