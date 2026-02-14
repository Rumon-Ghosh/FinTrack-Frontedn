import React, { useState } from 'react';
import { User, Mail, Camera, Save, Shield, CheckCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useImageUpload from '../../hooks/useImageUpload';
import Swal from 'sweetalert2';

const Profile = () => {
    const { user, fetchUserStatus } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { uploadImage, uploading: imageUploading } = useImageUpload();
    const [updating, setUpdating] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.photo || '');

    const [formData, setFormData] = useState({
        fullname: user?.fullname || '',
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            let photoUrl = user?.photo;

            if (selectedFile) {
                const uploadedUrl = await uploadImage(selectedFile);
                if (uploadedUrl) {
                    photoUrl = uploadedUrl;
                } else {
                    return;
                }
            }

            const res = await axiosSecure.patch('/users/profile', {
                fullname: formData.fullname,
                photo: photoUrl
            });

            if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
                await fetchUserStatus(); // Refresh global auth state
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated',
                    text: 'Your information has been saved successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
                setSelectedFile(null);
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to update profile', 'error');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black tracking-tight">Account Settings</h2>
                <p className="text-base-content/60 mt-1">Manage your public profile and account details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Avatar Preview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card bg-base-100 border border-base-content/5 shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                            <div className="avatar">
                                <div className="w-32 h-32 rounded-3xl border-4 border-primary/20 p-1 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                                    <img src={previewUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="Avatar Preview" className="object-cover w-full h-full" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-content p-2 rounded-xl shadow-lg">
                                <Camera className="size-4" />
                            </div>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        <h3 className="text-xl font-bold mt-6">{user?.fullname}</h3>
                        <p className="text-sm opacity-50 font-medium lowercase tracking-tight">{user?.email}</p>

                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            <div className="badge badge-primary gap-1 font-bold h-7 px-3">
                                <Shield className="size-3" /> {user?.role === 'admin' ? 'Administrator' : 'Verified User'}
                            </div>
                            <div className="badge badge-success gap-1 font-bold h-7 px-3 text-success-content">
                                <CheckCircle className="size-3" /> Active
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Edit Form */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 border border-base-content/5 shadow-sm">
                        <div className="card-body p-8">
                            <form onSubmit={handleUpdate} className="space-y-6">
                                {/* Email (Disabled) */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold">Email Address</span>
                                    </label>
                                    <div className="relative opacity-60">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5" />
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="input input-bordered w-full pl-12 bg-base-200 cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <label className="label">
                                        <span className="label-text-alt text-base-content/40 italic">Linked to your account, cannot be changed.</span>
                                    </label>
                                </div>

                                {/* Full Name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold">Public Display Name</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/30" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullname}
                                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                            className="input input-bordered w-full pl-12 focus:border-primary font-bold"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating || imageUploading}
                                    className={`btn btn-primary w-full h-14 rounded-2xl shadow-xl shadow-primary/20 text-lg gap-2 ${(updating || imageUploading) ? 'loading' : ''}`}
                                >
                                    {!(updating || imageUploading) && <Save className="size-5" />}
                                    {imageUploading ? 'Uploading Image...' : updating ? 'Updating Profile...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
