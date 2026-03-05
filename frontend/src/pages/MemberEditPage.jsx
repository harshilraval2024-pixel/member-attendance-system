import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { memberStore } from '../stores';
import MemberForm from '../components/forms/MemberForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { showSuccess, showError } from '../utils/swal';

const MemberEditPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    memberStore.fetchMember(id);
    return () => memberStore.clearCurrentMember();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await memberStore.updateMember(id, values);
      showSuccess('Updated!', 'Member details saved successfully.');
      navigate(`/members/${id}`);
    } catch (err) {
      showError('Update Failed', memberStore.error || 'Failed to update member');
    }
  };

  if (memberStore.loading || !memberStore.currentMember) {
    return <LoadingSpinner message="Loading member data..." />;
  }

  return (
    <div className="container py-4">
      <div className="page-header">
        <h2>
          <span className="header-icon header-icon-blue">
            <FontAwesomeIcon icon={faEdit} />
          </span>
          Edit Member
        </h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)} style={{ borderRadius: '8px' }}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Back
        </button>
      </div>

      {memberStore.error && (
        <div className="alert alert-danger">{memberStore.error}</div>
      )}

      <MemberForm
        initialValues={memberStore.currentMember}
        onSubmit={handleSubmit}
        isEditing
      />
    </div>
  );
});

export default MemberEditPage;
