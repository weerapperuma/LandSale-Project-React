import React, { useState } from "react";
import rawDistrictCityData from "../data/districtCities.json";

type DistrictCityData = {
    [districtName: string]: string[];
};

const districtCityData = rawDistrictCityData as DistrictCityData;

const CreateLand: React.FC = () => {
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [customCity, setCustomCity] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [size, setSize] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const token = localStorage.getItem("token");
    const userId: string = localStorage.getItem("userId") || "";

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (!e.target.files) return;

        const selected = Array.from(e.target.files);
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        const combined = [...images];

        for (const file of selected) {
            if (!validTypes.includes(file.type)) {
                setError("Only JPG and PNG images are allowed.");
                return;
            }
            // Avoid duplicates by name and size
            if (
                combined.some(
                    (existingFile) => existingFile.name === file.name && existingFile.size === file.size
                )
            ) {
                continue;
            }
            combined.push(file);
            if (combined.length > 3) {
                setError("You can upload up to 3 images.");
                return;
            }
        }
        setImages(combined);
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("district", district);
            formData.append("city", city === "Other" ? customCity : city);
            formData.append("price", price);
            formData.append("size", size);
            formData.append("userId", userId);

            // Append all selected images
            images.forEach((file) => {
                formData.append("images", file);
            });

            console.log("Sending data to backend:");
            console.log("title:", title);
            console.log("description:", description);
            console.log("district:", district);
            console.log("city:", city === "Other" ? customCity : city);
            console.log("price:", price);
            console.log("size:", size);
            console.log("userId:", userId);
            console.log("images:", images);


            // Call backend API
            const response = await fetch("http://localhost:5000/api/v1/lands", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Do NOT set Content-Type manually when sending FormData
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error: ${response.statusText}`);
            }

            // const data = await response.json();
            setSuccess("Land created successfully!");
            // Clear form fields and images
            setDistrict("");
            setCity("");
            setCustomCity("");
            setTitle("");
            setDescription("");
            setPrice("");
            setSize("");
            setImages([]);

        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const citiesForDistrict = district ? districtCityData[district] || [] : [];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Create Land Listing</h2>

            {error && <div className="mb-4 p-2 bg-red-200 text-red-700 rounded">{error}</div>}
            {success && (
                <div className="mb-4 p-2 bg-green-200 text-green-700 rounded">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block font-semibold">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                        disabled={loading}
                    />
                </div>

                {/* District */}
                <div>
                    <label className="block font-semibold">District</label>
                    <select
                        value={district}
                        onChange={(e) => {
                            setDistrict(e.target.value);
                            setCity("");
                            setCustomCity("");
                        }}
                        className="w-full border rounded px-3 py-2"
                        required
                        disabled={loading}
                    >
                        <option value="">Select District</option>
                        {Object.keys(districtCityData).map((districtName) => (
                            <option key={districtName} value={districtName}>
                                {districtName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* City */}
                {district && (
                    <div>
                        <label className="block font-semibold">City</label>
                        <select
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setCustomCity("");
                            }}
                            className="w-full border rounded px-3 py-2"
                            required
                            disabled={loading}
                        >
                            <option value="">Select City</option>
                            {citiesForDistrict.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                            <option value="Other">Other (Type Your City)</option>
                        </select>
                    </div>
                )}

                {/* Custom City */}
                {city === "Other" && (
                    <div>
                        <label className="block font-semibold">Your City</label>
                        <input
                            type="text"
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                            disabled={loading}
                        />
                    </div>
                )}

                {/* Price */}
                <div>
                    <label className="block font-semibold">Price (LKR)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                        disabled={loading}
                        min={0}
                    />
                </div>

                {/* Size */}
                <div>
                    <label className="block font-semibold">Size (perches)</label>
                    <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                        disabled={loading}
                        min={0}
                        step={0.1}
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block font-semibold">Images (Max 3)</label>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                        disabled={loading}
                    />
                    {images.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-3">
                            {images.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative border rounded overflow-hidden group"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-24 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>
                                    <p className="text-xs text-center p-1 break-all">{file.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${
                        loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                    } transition`}
                >
                    {loading ? "Submitting..." : "Submit Listing"}
                </button>
            </form>
        </div>
    );
};

export default CreateLand;
