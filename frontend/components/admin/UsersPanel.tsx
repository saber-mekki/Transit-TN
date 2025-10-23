import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useI18n } from '../../hooks/useI18n';
import { User, UserRole } from '../../types';

export const UsersPanel: React.FC = () => {
    const { allUsers, updateUserRole, deleteUser, currentUser } = useAppContext();
    const { t } = useI18n();

    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        updateUserRole(userId, newRole);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-bold p-4 border-b dark:border-gray-700">{t('manageUsers')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('displayName')}</th>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">{t('role')}</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(user => (
                            <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{user.displayName}</td>
                                <td className="px-6 py-4">{user.username}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                                        className="p-1 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                        disabled={user.id === currentUser?.id}
                                    >
                                        {Object.values(UserRole).map(role => (
                                            <option key={role} value={role}>{role.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={user.id === currentUser?.id}
                                    >
                                        {t('delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">{t('deleteUserConfirmation')}</h3>
                        <p>User: <span className="font-semibold">{userToDelete.displayName}</span> ({userToDelete.username})</p>
                        <div className="flex justify-end mt-6 space-x-2">
                            <button onClick={() => setUserToDelete(null)} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('cancel')}</button>
                            <button onClick={confirmDelete} className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">{t('delete')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};