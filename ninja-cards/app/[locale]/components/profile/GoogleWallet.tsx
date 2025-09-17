import { BASE_API_URL } from "@/utils/constants";
import { User } from "next-auth";
import { useState } from "react";

const AddToGoogleWallet = ({ user }: { user: User }) => {
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/parata`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    userName: user.name
                    // profileImageUrl: user.image,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // ✅ Redirect to Google Wallet (NO 413)
            window.location.href = `https://pay.google.com/gp/v/save/${data.token}`;
        } catch (err) {
            console.error("Failed to add to Google Wallet", err);
            alert("Failed to add to Google Wallet");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleAdd} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Adding..." : "Add to Google Wallet"}
        </button>
    );
};

export default AddToGoogleWallet;
