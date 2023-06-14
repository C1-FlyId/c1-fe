'use client';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordInput({
    className = 'rounded-rad-4 border-neutral-2 px-6 py-[14px] text-body-c font-normal focus:border-purple-4',
    id,
    placeholder,
    ...rest
}) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <div className='relative'>
            <input
                {...rest}
                id={id}
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
                className={`${className} w-full appearance-none border  font-poppins outline-none`}
            />
            {showPassword ? (
                <FiEye onClick={togglePassword} className='absolute right-1 top-[50%] mr-3 h-5 w-5 translate-y-[-50%] cursor-pointer text-purple-4' />
            ) : (
                <FiEyeOff
                    onClick={togglePassword}
                    className='absolute right-1 top-[50%] mr-3 h-5 w-5 translate-y-[-50%] cursor-pointer text-neutral-3'
                />
            )}
        </div>
    );
}
