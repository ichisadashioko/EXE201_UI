import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import api, { api_update_display_name, api_upload_user_image, api_user_set_profile_picture, api_user_update_extra_info, getAccessToken } from '../authentication';

import { CameraIcon } from 'lucide-react';
import type { PetImageInfo } from '../typing';

const EditProfile = () => {
    const [displayName, setDisplayName] = useState('');
    const [address, setAddress] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = getAccessToken();
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await api.api_get_user_profile(token);
                if (response.success) {
                    if ((response.data == null) || (response.data.user == null)) {
                        console.error("User profile data is null");
                        return;
                    }

                    let user_obj = response.data.user;

                    setDisplayName(user_obj.name || '');

                    let address = '';

                    // parse extra_info_json for address
                    if (user_obj.extra_info_json) {
                        try {
                            const extraInfo = JSON.parse(user_obj.extra_info_json);
                            address = extraInfo.address || '';
                        } catch (err) {
                            console.error("Failed to parse extra_info_json:", err);
                        }
                    }

                    setAddress(address || '');
                    setProfileImageUrl(user_obj.profile_image_url || null);
                } else {
                    setError(response.message || 'Failed to fetch profile.');
                }
            } catch (err) {
                setError('An unexpected error occurred while fetching your profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file.');
                return;
            }
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const token = getAccessToken();
        if (!token) {
            navigate('/login');
            return;
        }
        if (!displayName.trim()) {
            setError("Display name cannot be empty.");
            return;
        }

        setSaving(true);
        try {
            // Step 1: Upload image if a new one is selected
            if (selectedFile) {
                let retval = await api_upload_user_image(token, selectedFile);
                console.debug(retval);
                if (retval.success) {
                    try {
                        let image_info: PetImageInfo = retval.data.image_info;
                        let image_id = image_info.id;

                        // TODO set as profile picture
                        let retval2 = await api_user_set_profile_picture(token, image_id);
                        console.debug(retval2);
                        if (!retval2.success) {
                            setError(retval2.message || 'Failed to set profile picture.');
                            setSaving(false);
                            return;
                        }

                        // let image_url = image_info.url;
                        // props.onSelect(image_url);
                    } catch (error) {
                        console.error("Error uploading image:");
                        console.error(error);
                        // alert(`Error uploading image: ${error}`);
                        setError(`${error}`);
                        setSaving(false);
                        return;
                    }
                    // alert("Image uploaded successfully");
                } else {
                    // alert(`Failed to upload image: ${retval.message}`);

                    setError(retval.message || 'Failed to upload image.');
                    setSaving(false);
                    return; // Stop if image upload fails
                }

                // const imageResponse = await api.api_upload_profile_picture(token, selectedFile);
                // if (!imageResponse.success) {
                //     setError(imageResponse.message || 'Failed to upload image.');
                //     setSaving(false);
                //     return; // Stop if image upload fails
                // }
            }

            // Step 2: Update profile text information
            let retval3 = await api_update_display_name(token, displayName);
            console.debug(retval3);
            if (!retval3.success) {
                setError(retval3.message || 'Failed to update display name.');
                setSaving(false);
                return;
            }

            let retval4 = await api_user_update_extra_info(token, JSON.stringify({ address }));
            console.debug(retval4);
            if (!retval4.success) {
                setError(retval4.message || 'Failed to update other info.');
                setSaving(false);
                return;
            }

            // TODO update address in extra_info_json

            // const profileResponse = await api.api_update_my_profile(token, { displayName, address });
            // if (profileResponse.success) {
            //     setSuccess('Profile updated successfully!');
            //     setTimeout(() => navigate('/profile'), 1500);
            // } else {
            //     setError(profileResponse.message || 'Failed to update profile details.');
            // }
        } catch (err) {
            setError('An unexpected error occurred while saving your profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading profile...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm mt-10">
            <h1 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h1>

            <div className="relative w-32 h-32 mx-auto mb-6">
                <img
                    src={imagePreview || profileImageUrl || '/assets/default-avatar.png'}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    aria-label="Change profile picture"
                >
                    <CameraIcon />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Ho Chi Minh City, Vietnam"
                    />
                </div>

                {error && <div className="text-sm text-red-600 mb-4 text-center">{error}</div>}
                {success && <div className="text-sm text-green-600 mb-4 text-center">{success}</div>}

                <div className="flex items-center justify-end gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" disabled={saving}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${saving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
