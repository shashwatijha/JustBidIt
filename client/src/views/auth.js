import React, { useEffect, useState } from 'react';

const Auth = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("/users")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setUsers(data)
            })
            .catch(err => console.error("Failed to fetch users", err));
    }, []);

    return (
        <div>
            <h2>Users</h2>
            {users.map(user => (
                <div key={user.id}>
                    <p>{user.username}</p>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
};

export default Auth;
