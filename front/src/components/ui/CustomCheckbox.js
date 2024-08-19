import React from 'react';
import { Checkbox } from '@headlessui/react';
import { FaCheck } from 'react-icons/fa';

const CustomCheckbox = ({ checked, onChange, children }) => {
    return (
        <Checkbox
            checked={checked}
            onChange={onChange}
            className={`group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset cursor-pointer ${
                checked ? 'bg-white' : ''
            }`}
        >
            {({ checked }) => (
                <>
                    <FaCheck
                        className={`hidden size-4 fill-black group-data-[checked]:block ${
                            checked ? 'block' : 'hidden'
                        }`}
                    />
                    {children}
                </>
            )}
        </Checkbox>
    );
};

export default CustomCheckbox;
