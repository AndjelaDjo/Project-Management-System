import { useState, useEffect } from 'react';
import axiosInstance from '../utilis/axiosInstance';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);

    const fetchUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/users/get-user');
            setUserInfo(response.data.user);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return userInfo;
};
