// pages/Profile.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Calendar,
  Clock,
  Key,
  Plus,
  Edit,
  Trash,
  ArrowLeft,
} from 'lucide-react';

// Profile main component
export const Profile = () => {
  const { userProfile, updateUserProfile, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className='flex-1 flex flex-col bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4'>
        <div className='flex items-center'>
          <button
            onClick={() => navigateTo('workflow')}
            className='mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          <h1 className='text-xl font-semibold text-gray-800 dark:text-white'>
            Your Profile
          </h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
        <nav className='flex px-6'>
          <button
            className={`py-4 px-4 ${
              activeTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`py-4 px-4 ${
              activeTab === 'projects'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            Your Projects
          </button>
          <button
            className={`py-4 px-4 ${
              activeTab === 'apikeys'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('apikeys')}
          >
            API Keys
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className='flex-1 overflow-auto p-6'>
        {activeTab === 'profile' && (
          <ProfileInfo
            userProfile={userProfile}
            updateUserProfile={updateUserProfile}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectsList projects={userProfile.projects} />
        )}
        {activeTab === 'apikeys' && (
          <ApiKeysList apiKeys={userProfile.apiKeys} />
        )}
      </div>
    </div>
  );
};

// Profile information component
const ProfileInfo = ({ userProfile, updateUserProfile }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    role: userProfile.role,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setEditing(false);
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-2xl'>
      <div className='p-6'>
        <div className='flex justify-between mb-6'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
            Profile Information
          </h2>
          <button
            onClick={() => setEditing(!editing)}
            className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center'
          >
            {editing ? (
              'Cancel'
            ) : (
              <>
                <Edit className='w-4 h-4 mr-1' />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Full Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='role'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Role
                </label>
                <select
                  id='role'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                >
                  <option value='Administrator'>Administrator</option>
                  <option value='Developer'>Developer</option>
                  <option value='Manager'>Manager</option>
                  <option value='Viewer'>Viewer</option>
                </select>
              </div>

              <div className='pt-4'>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className='space-y-6'>
            <div className='flex items-center'>
              <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4'>
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className='w-16 h-16 rounded-full'
                  />
                ) : (
                  <User className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                )}
              </div>
              <div>
                <h3 className='text-xl font-medium text-gray-800 dark:text-white'>
                  {userProfile.name}
                </h3>
                <p className='text-gray-500 dark:text-gray-400'>
                  {userProfile.role}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div className='flex items-center'>
                <Mail className='w-5 h-5 text-gray-500 dark:text-gray-400 mr-2' />
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>Email</p>
                  <p className='text-gray-800 dark:text-white'>
                    {userProfile.email}
                  </p>
                </div>
              </div>

              <div className='flex items-center'>
                <Calendar className='w-5 h-5 text-gray-500 dark:text-gray-400 mr-2' />
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Member Since
                  </p>
                  <p className='text-gray-800 dark:text-white'>
                    {userProfile.joinDate}
                  </p>
                </div>
              </div>

              <div className='flex items-center'>
                <Clock className='w-5 h-5 text-gray-500 dark:text-gray-400 mr-2' />
                <div>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Last Active
                  </p>
                  <p className='text-gray-800 dark:text-white'>
                    {userProfile.lastActive}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Projects list component
const ProjectsList = ({ projects }) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
      <div className='p-6'>
        <div className='flex justify-between mb-6'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
            Your Projects
          </h2>
          <button className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center'>
            <Plus className='w-4 h-4 mr-1' />
            New Project
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-gray-700'>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Name
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Status
                </th>
                <th className='py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className='py-4 px-4 text-sm text-gray-800 dark:text-white'>
                    {project.name}
                  </td>
                  <td className='py-4 px-4'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${
                        project.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : project.status === 'Draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className='py-4 px-4 text-right space-x-2'>
                    <button className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
                      <Edit className='w-4 h-4 inline' />
                    </button>
                    <button className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'>
                      <Trash className='w-4 h-4 inline' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// API Keys list component
const ApiKeysList = ({ apiKeys }) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
      <div className='p-6'>
        <div className='flex justify-between mb-6'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
            API Keys
          </h2>
          <button className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center'>
            <Key className='w-4 h-4 mr-1' />
            Generate New Key
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-gray-700'>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Name
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Created
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Last Used
                </th>
                <th className='py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td className='py-4 px-4 text-sm text-gray-800 dark:text-white'>
                    {key.name}
                  </td>
                  <td className='py-4 px-4 text-sm text-gray-600 dark:text-gray-300'>
                    {key.created}
                  </td>
                  <td className='py-4 px-4 text-sm text-gray-600 dark:text-gray-300'>
                    {key.lastUsed}
                  </td>
                  <td className='py-4 px-4 text-right space-x-2'>
                    <button className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
                      <Edit className='w-4 h-4 inline' />
                    </button>
                    <button className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'>
                      <Trash className='w-4 h-4 inline' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
