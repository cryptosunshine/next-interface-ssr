import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { disconnect } from '@wagmi/core'

import { useSelector, useDispatch } from 'react-redux';

import { setAuthToken } from '@/store/user/reducer';

export const useLogin = (message: string) => {
    const { address } = useAccount();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);

    const { data, error, isLoading, signMessageAsync } = useSignMessage({
        message,
    });

    useEffect(() => {
        if (!user.authToken) {
            signMessageAsync();
        }
        
        if(!address) {
            dispatch(setAuthToken({ authToken: undefined }));
        }
    }, [address]);

    useEffect(() => {
        if (data) {
            dispatch(setAuthToken({ authToken: data }));
        }


        if (error) {
            disconnect()
        }
    }, [data, error, isLoading]);

    if (user.authToken) {
        return { data: user.authToken }
    }

    return { data };
};