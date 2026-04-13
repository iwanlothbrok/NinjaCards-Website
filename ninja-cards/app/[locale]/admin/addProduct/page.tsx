import AddProductPanel from '../components/AddProductPanel';

export default function AddProductPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#05080c] via-darkBg to-black px-6 py-10 text-white">
            <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/8 bg-[#071018]/85 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <h1 className="text-3xl font-bold">Add Product</h1>
                <p className="mt-2 text-sm text-white/55">Protected by the new admin session system.</p>
                <div className="mt-8">
                    <AddProductPanel />
                </div>
            </div>
        </div>
    );
}
