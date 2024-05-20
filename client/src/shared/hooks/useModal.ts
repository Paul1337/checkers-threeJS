import { useState } from 'react';

export const useModal = () => {
    const [isShown, setIsShown] = useState(false);

    return {
        show() {
            setIsShown(true);
        },

        hide() {
            setIsShown(false);
        },

        toggle() {
            setIsShown(show => !show);
        },

        isShown,
    };
};
