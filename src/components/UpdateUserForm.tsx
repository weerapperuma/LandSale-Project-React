import React, { useState, useEffect } from "react";

type User = {
    _id: string;
    name: string;
    email: string;
    address: string;
    role: "ADMIN" | "USER";
    phoneNumber: string;
};

type UpdateUserFormProps = {
    user: User;
    isAdminEdit?: boolean;
    token: string;
    onClose: () => void;
    onUpdate: (updatedUser: User) => void;
};

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
                                                           user,
                                                           isAdminEdit = false,
                                                           token,
                                                           onClose,
                                                           onUpdate,
                                                       }) => {
    // Initialize formData with user prop when component mounts or user changes
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phoneNumber: "",
        role: "USER" as "USER" | "ADMIN",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
                role: user.role || "USER",
            });
        }
    }, [user]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const updatePayload = {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            ...(isAdminEdit ? { role: formData.role } : {}),
        };

        try {
            const url = isAdminEdit
                ? `http://localhost:5000/api/v1/user/admin/${user._id}`
                : `http://localhost:5000/api/v1/user/${user._id}`;

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatePayload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Update failed");
            } else {
                onUpdate(data.data); // Pass updated user back to parent
                onClose();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Update User</h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Address</label>
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            type="text"
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Phone Number</label>
                        <input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            type="tel"
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    {isAdminEdit && (
                        <div>
                            <label className="block font-semibold mb-1">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserForm;
