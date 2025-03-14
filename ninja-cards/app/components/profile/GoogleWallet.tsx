'use client'
import { BASE_API_URL } from "@/utils/constants";
import { useState } from "react";

const AddToGoogleWallet = ({ userId }: { userId: string }) => {
    const [loading, setLoading] = useState(false);

    const handleAddToGoogleWallet = async () => {
        console.log("User ID being sent:", userId);
        const formData = new FormData();
        formData.append("userId", userId);


        console.log('formData', formData);
        console.log('userId in form', formData.get('userId'));

        try {
            const response = await fetch(`${BASE_API_URL}/api/parata`, {
                method: "POST",
                body: formData, // ✅ Send as FormData instead of JSON
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (!response.ok) {
                alert(`Error: ${data.message || response.status}`);
                return;
            }

            // // ✅ Redirect to Google Wallet
            window.location.href = `https://pay.google.com/gp/v/save/${data.token}`;

        } catch (error) {
            console.error("Failed to add to Google Wallet:", error);
        }
    };

    //da mu eba mamata 
    return (
        <button
            onClick={handleAddToGoogleWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
        >
            {loading ? "Adding..." : "Add to Google Wallet"}
        </button>
    );
};

export default AddToGoogleWallet;
