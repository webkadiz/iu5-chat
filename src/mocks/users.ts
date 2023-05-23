export type User = {
    id: number;
    avatar: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
};

export default [
    {
        username: 'test',
        firstName: 'Test',
        lastName: 'Testov',
        fullName: 'Test Testov',
        id: 1,
        avatar: '',
    },
    {
        username: 'vany',
        firstName: 'Ivan',
        lastName: 'Ivanov',
        fullName: 'Ivan Ivanov',
        id: 2,
        avatar: '',
    },
    {
        username: 'alexander',
        firstName: 'Alex',
        lastName: 'Alexov',
        fullName: 'Alex Alexov',
        id: 3,
        avatar: '',
    },
    {
        username: 'vlad',
        firstName: 'Vlad',
        lastName: 'Vladislavovich',
        fullName: 'Vlad Vladislavovich',
        id: 4,
        avatar: '',
    },
];
