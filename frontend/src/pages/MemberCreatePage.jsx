import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { memberStore } from '../stores';
import MemberForm from '../components/forms/MemberForm';
import { showSuccess, showError } from '../utils/swal';

const MemberCreatePage = observer(() => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await memberStore.createMember(values);
      showSuccess('Registered!', 'New member has been added successfully.');
      navigate('/members');
    } catch (err) {
      showError('Registration Failed', memberStore.error || 'Failed to register member');
    }
  };

  return (
    <div className="container py-4">
      <div className="page-header">
        <h2>
          <span className="header-icon header-icon-teal">
            <FontAwesomeIcon icon={faUserPlus} />
          </span>
          Register New Member
        </h2>
      </div>

      {memberStore.error && (
        <div className="alert alert-danger">{memberStore.error}</div>
      )}

      <MemberForm onSubmit={handleSubmit} />
    </div>
  );
});

export default MemberCreatePage;
