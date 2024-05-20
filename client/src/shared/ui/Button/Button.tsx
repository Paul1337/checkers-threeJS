import { ButtonHTMLAttributes, FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: FC<ButtonProps> = props => {
    return (
        <button
            {...props}
            className={twMerge(
                'p-2 text-center border border-gray-400 rounded-md mt-2 bg-gray-100 hover:bg-white duration-200',
                props.className
            )}
        />
    );
};
