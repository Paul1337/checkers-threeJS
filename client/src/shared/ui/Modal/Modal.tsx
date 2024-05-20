import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button/Button';

export interface ModalProps {
    title: string;
    content: string;
    onClose?: () => void;
}

export const Modal: FC<ModalProps> = props => {
    console.log('modal');
    return createPortal(
        <div className='w-full h-full absolute left-0 top-0 bg-gray-100 bg-opacity-20'>
            <div className='bg-white bg-opacity-80 p-4 rounded-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-h-[200px] min-w-[300px]'>
                <div className='flex justify-between gap-8'>
                    <p className='text-2xl font-semibold'>{props.title}</p>
                    <div
                        className='cursor-pointer bg-gray-100 w-8 h-8 border border-gray-400 rounded-md flex justify-center items-center hover:bg-white duration-200'
                        onClick={props.onClose}
                    >
                        &times;
                    </div>
                </div>
                <div className='mt-2'>{props.content}</div>
            </div>
        </div>,
        document.body
    );
};
