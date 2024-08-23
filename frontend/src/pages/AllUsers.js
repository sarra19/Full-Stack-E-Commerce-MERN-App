import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit, MdDelete, MdAdd } from 'react-icons/md';
import ChangeUserRole from '../components/ChangeUserRole';
import AddUser from '../components/AddUser';

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: ""
    });

    const fetchAllUsers = async () => {
        const fetchData = await fetch(SummaryApi.allUser.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include'
        });

        const dataResponse = await fetchData.json();

        if (dataResponse.success) {
            setAllUsers(dataResponse.data);
        }

        if (dataResponse.error) {
            toast.error(dataResponse.message);
        }
    };

    const deleteUser = async (userId) => {
        const fetchData = await fetch(SummaryApi.delete_user.url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });

        const dataResponse = await fetchData.json();

        if (dataResponse.success) {
            toast.success('User deleted successfully');
            fetchAllUsers(); // Refresh the user list
        }

        if (dataResponse.error) {
            toast.error(dataResponse.message);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div className='bg-white pb-4'>
        <div className='bg-white py-2 px-4 flex justify-between items-center'>
    <h2 className='font-bold text-lg'>All Users</h2>
    <button
        className='border-2 border-red-600 text-pink-600 hover:bg-pink-600 hover:text-white transition-all py-1 px-3 rounded-full'
        onClick={() => setOpenAddUser(true)}
    >
        <MdAdd className='text-xl inline-block align-middle' />
        <span className='inline-block align-middle ml-1'>Add User</span>
    </button>
</div>




            <table className='w-full userTable'>
                <thead>
                    <tr className='bg-black text-white'>
                        <th>Sr.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created Date</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        allUser.map((el, index) => (
                            <tr key={el._id}>
                                <td>{index + 1}</td>
                                <td>{el?.name}</td>
                                <td>{el?.email}</td>
                                <td>{el?.role}</td>
                                <td>{moment(el?.createdAt).format('LL')}</td>
                                <td className='text-center'>
                                    <div className='flex justify-center space-x-2'>
                                        <button
                                            className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                                            onClick={() => {
                                                setUpdateUserDetails(el);
                                                setOpenUpdateRole(true);
                                            }}
                                        >
                                            <MdModeEdit />
                                        </button>
                                        <button
                                            className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white'
                                            onClick={() => deleteUser(el._id)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {openUpdateRole && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}

            {openAddUser && (
                <AddUser
                    onClose={() => setOpenAddUser(false)}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    );
};

export default AllUsers;
