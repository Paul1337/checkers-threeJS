import uuid4 from 'uuid4';

export const generateId = () => {
    return (Date.now() % 1000000).toString();
};
