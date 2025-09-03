import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { groupService } from '../../services/groupService';
import { notesService } from '../../services/notesService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Dashboard.css';

import welcomeImage from '../../assets/image.png';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState('');

  const [groupForm, setGroupForm] = useState({ name: '', color: '' });
  const [formErrors, setFormErrors] = useState({});

  const { logout, user } = useAuth();

  const colors = ['#B38BFA', '#FF79F2', '#43E6FC', '#F19576', '#0047FF', '#6691FF'];

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadNotes(selectedGroup._id);
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const response = await groupService.getGroups();
      setGroups(response.groups);
    } catch {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async (groupId) => {
    setNotesLoading(true);
    try {
      const response = await notesService.getGroupNotes(groupId);
      setNotes(response.notes);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!groupForm.name.trim()) errors.name = 'Group name is required';
    else if (groupForm.name.trim().length < 2) errors.name = 'Group name must be at least 2 characters';
    if (!groupForm.color) errors.color = 'Please select a color';
    if (groups.find(g => g.name.toLowerCase() === groupForm.name.trim().toLowerCase())) errors.name = 'You already have a group with this name';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await groupService.createGroup(groupForm.name.trim(), groupForm.color);
      setGroups([...groups, response.group]);
      setSelectedGroup(response.group);
      closeModal();
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to create group');
    }
  };

  const handleSendNote = async () => {
    if (!newNote.trim() || !selectedGroup) return;
    try {
      const response = await notesService.createNote(selectedGroup._id, newNote.trim());
      setNotes([...notes, response.note]);
      setNewNote('');
      toast.success('Note added!');
    } catch (error) {
      toast.error(error.message || 'Failed to add note');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendNote();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGroupForm({ name: '', color: '' });
    setFormErrors({});
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const dateString = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return (
      <span>
        {dateString}
        <span style={{ margin: '0 10px', fontWeight: 'bold' }}>•</span>
        {timeString}
      </span>
    );
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">Pocket Notes</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        <div className="groups-list">
          {groups.map((group) => (
            <div
              key={group._id}
              className={`group-item ${selectedGroup?._id === group._id ? 'active' : ''}`}
              onClick={() => setSelectedGroup(group)}
            >
              <div className="group-avatar" style={{ backgroundColor: group.color }}>
                {group.initials}
              </div>
              <span className="group-name">{group.name}</span>
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          +
        </button>
      </div>

      <div className="main-content">
        {!selectedGroup ? (
          <div className="welcome-screen">
            <img src={welcomeImage} alt="Welcome" className="welcome-image" />
            <h2 className="welcome-main-title">Pocket Notes</h2>
            <p className="welcome-desc">Send and receive messages without keeping your phone online.</p>
            <p className="welcome-desc">
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone
            </p>
            <div className="encryption">
              🔒 <span>end-to-end encrypted</span>
            </div>
          </div>
        ) : (
          <div className="notes-view">
            <div className="notes-header">
              <div className="selected-avatar" style={{ backgroundColor: selectedGroup.color }}>
                {selectedGroup.initials}
              </div>
              <h2>{selectedGroup.name}</h2>
            </div>

            <div className="notes-list">
              {notesLoading ? (
                <div className="notes-loading">Loading notes...</div>
              ) : notes.length === 0 ? (
                <div className="no-notes">
                  <p>No notes yet. Start the conversation!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className="note-item">
                    <div className="note-card">
                      <div className="note-text">{note.text}</div>
                      <div className="note-meta">{formatTimestamp(note.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="note-input-area">
              <div className="input-wrapper">
                <textarea
                  className="note-input"
                  placeholder="Enter your text here..........."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows="3"
                />
                <button
                  className={`send-btn ${newNote.trim() ? 'active' : ''}`}
                  onClick={handleSendNote}
                  disabled={!newNote.trim()}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Group</h3>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  className="group-name-input"
                  placeholder="Enter group name"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label>Choose colour</label>
                <div className="color-options">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      style={{ backgroundColor: color }}
                      className={groupForm.color === color ? 'selected' : ''}
                      onClick={() => setGroupForm({ ...groupForm, color })}
                    />
                  ))}
                </div>
                {formErrors.color && <div className="error-message">{formErrors.color}</div>}
              </div>

              <button type="submit" className="create-btn">
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
