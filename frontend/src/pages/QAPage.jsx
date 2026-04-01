import React, { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle,
  faPlus,
  faArrowLeft,
  faThumbsUp,
  faCheckCircle,
  faTrash,
  faTag,
  faSearch,
  faTimes,
  faEye,
  faCommentDots,
  faPaperPlane,
  faSpinner,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { qaStore } from '../stores';
import { confirmAction, showSuccess } from '../utils/swal';

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_BADGE = {
  open: 'badge-blue',
  answered: 'badge-teal',
  closed: 'badge-warning',
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

// ─── AskForm ────────────────────────────────────────────────────────────────

const AskForm = observer(({ onBack, onCreated }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleTagKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    else if (title.trim().length < 10) errs.title = 'Title must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const q = await qaStore.createQuestion({ title: title.trim(), body: body.trim(), tags });
      showSuccess('Question posted!');
      onCreated(q);
    } catch {
      // error handled by store
    }
  };

  return (
    <div>
      <button className="btn btn-sm btn-outline-secondary mb-3" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
        Back to Questions
      </button>

      <div className="card shadow-sm">
        <div className="card-header card-header-teal d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faQuestionCircle} />
          <span>Ask a Question</span>
        </div>
        <div className="card-body">
          {qaStore.error && (
            <div className="alert alert-danger py-2 mb-3">{qaStore.error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">
                Title <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. How do I mark attendance for a holiday?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
              <div className="form-text text-end" style={{ fontSize: '0.78rem' }}>
                {title.length}/200
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Details <span className="text-muted">(optional)</span>
              </label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Provide more context, steps you've tried, expected behaviour…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={5000}
              />
              <div className="form-text text-end" style={{ fontSize: '0.78rem' }}>
                {body.length}/5000
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">
                Tags <span className="text-muted">(up to 5)</span>
              </label>
              <div className="d-flex gap-2 mb-2 flex-wrap">
                {tags.map((t) => (
                  <span key={t} className="tag-badge tag-skill">
                    <FontAwesomeIcon icon={faTag} style={{ fontSize: '0.7rem' }} />
                    {t}
                    <span
                      className="tag-remove ms-1"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Add tag (press Enter or comma)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  disabled={tags.length >= 5}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={addTag}
                  disabled={tags.length >= 5}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={qaStore.submitting}
              >
                {qaStore.submitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Posting…
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                    Post Question
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

// ─── AnswerForm ──────────────────────────────────────────────────────────────

const AnswerForm = observer(({ questionId }) => {
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setError('Answer cannot be empty');
      return;
    }
    setError('');
    try {
      await qaStore.addAnswer(questionId, { body: body.trim() });
      setBody('');
      showSuccess('Answer posted!');
    } catch {
      // store handles it
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <label className="form-label fw-semibold">Your Answer</label>
      <textarea
        className={`form-control mb-2 ${error ? 'is-invalid' : ''}`}
        rows={4}
        placeholder="Write your answer here…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={2000}
      />
      {error && <div className="invalid-feedback d-block mb-2">{error}</div>}
      <div className="d-flex justify-content-between align-items-center">
        <span className="form-text" style={{ fontSize: '0.78rem' }}>
          {body.length}/2000
        </span>
        <button type="submit" className="btn btn-primary btn-sm" disabled={qaStore.submitting}>
          {qaStore.submitting ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} className="me-1" />
              Submit Answer
            </>
          )}
        </button>
      </div>
    </form>
  );
});

// ─── QuestionDetail ──────────────────────────────────────────────────────────

const QuestionDetail = observer(({ questionId, onBack }) => {
  useEffect(() => {
    qaStore.fetchQuestion(questionId);
    return () => qaStore.clearCurrentQuestion();
  }, [questionId]);

  const q = qaStore.currentQuestion;

  const handleDeleteAnswer = async (answerId) => {
    const result = await confirmAction('Delete this answer?', 'This cannot be undone.', 'Yes, delete');
    if (!result.isConfirmed) return;
    try {
      await qaStore.deleteAnswer(q._id, answerId);
      showSuccess('Answer deleted');
    } catch {
      // store handles it
    }
  };

  const handleAccept = async (answerId) => {
    await qaStore.acceptAnswer(q._id, answerId);
    showSuccess('Answer accepted!');
  };

  if (qaStore.loading || !q) {
    return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-primary" />
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-sm btn-outline-secondary mb-3" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
        Back to Questions
      </button>

      {/* Question card */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex align-items-start gap-2 mb-2 flex-wrap">
            <span
              className={`badge ${STATUS_BADGE[q.status] || 'badge-blue'} text-capitalize`}
              style={{ fontSize: '0.75rem' }}
            >
              {q.status}
            </span>
            {q.tags.map((t) => (
              <span key={t} className="badge-skill" style={{ fontSize: '0.72rem' }}>
                <FontAwesomeIcon icon={faTag} className="me-1" style={{ fontSize: '0.65rem' }} />
                {t}
              </span>
            ))}
          </div>

          <h5 className="fw-bold mb-2" style={{ color: 'var(--gray-800)' }}>
            {q.title}
          </h5>

          {q.body && (
            <p className="mb-3" style={{ color: 'var(--gray-600)', whiteSpace: 'pre-wrap', fontSize: '0.92rem' }}>
              {q.body}
            </p>
          )}

          <div className="d-flex align-items-center gap-3 flex-wrap" style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
            <span>
              <FontAwesomeIcon icon={faEye} className="me-1" />
              {q.views} views
            </span>
            <span>
              <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
              {q.upvotes} upvotes
            </span>
            <span>
              <FontAwesomeIcon icon={faCommentDots} className="me-1" />
              {q.answers.length} answer{q.answers.length !== 1 ? 's' : ''}
            </span>
            <span className="ms-auto">{q.author} · {timeAgo(q.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Answers */}
      <h6 className="section-title mb-3">
        <FontAwesomeIcon icon={faCommentDots} className="me-2 text-primary" />
        {q.answers.length} Answer{q.answers.length !== 1 ? 's' : ''}
      </h6>

      {q.answers.length === 0 && (
        <div className="text-center py-4 text-muted mb-3" style={{ fontSize: '0.9rem' }}>
          No answers yet. Be the first to help!
        </div>
      )}

      {q.answers.map((a) => (
        <div
          key={a._id}
          className="card mb-3 shadow-sm"
          style={{
            borderLeft: a.isAccepted ? '4px solid var(--success)' : '4px solid var(--gray-200)',
          }}
        >
          <div className="card-body">
            {a.isAccepted && (
              <div className="d-flex align-items-center gap-1 mb-2" style={{ color: 'var(--success)', fontSize: '0.82rem' }}>
                <FontAwesomeIcon icon={faCheckCircle} />
                <span className="fw-semibold">Accepted Answer</span>
              </div>
            )}
            <p className="mb-3" style={{ whiteSpace: 'pre-wrap', fontSize: '0.92rem', color: 'var(--gray-700)' }}>
              {a.body}
            </p>
            <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
              <span>{a.author} · {timeAgo(a.createdAt)}</span>
              <div className="ms-auto d-flex gap-2">
                {!a.isAccepted && (
                  <button
                    className="btn btn-sm btn-action"
                    title="Accept this answer"
                    onClick={() => handleAccept(a._id)}
                    style={{ color: 'var(--success)', borderColor: 'var(--success)' }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </button>
                )}
                <button
                  className="btn btn-sm btn-action btn-action-danger"
                  title="Delete answer"
                  onClick={() => handleDeleteAnswer(a._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Answer form */}
      <div className="card shadow-sm">
        <div className="card-header card-header-light">
          <FontAwesomeIcon icon={faCommentDots} className="me-2 text-primary" />
          Post an Answer
        </div>
        <div className="card-body">
          {qaStore.error && (
            <div className="alert alert-danger py-2 mb-2">{qaStore.error}</div>
          )}
          <AnswerForm questionId={q._id} />
        </div>
      </div>
    </div>
  );
});

// ─── QuestionList ────────────────────────────────────────────────────────────

const QuestionList = observer(({ onSelect, onAsk }) => {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [activeStatus, setActiveStatus] = useState('');

  const load = useCallback(
    (extra = {}) => {
      qaStore.fetchQuestions({ search, tag: activeTag, status: activeStatus, ...extra });
    },
    [search, activeTag, activeStatus]
  );

  useEffect(() => {
    qaStore.fetchAllTags();
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    qaStore.setPage(1);
    load();
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTag('');
    setActiveStatus('');
    qaStore.setPage(1);
    qaStore.fetchQuestions({ search: '', tag: '', status: '' });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await confirmAction('Delete this question?', 'All answers will also be removed.', 'Yes, delete');
    if (!result.isConfirmed) return;
    try {
      await qaStore.deleteQuestion(id);
      showSuccess('Question deleted');
    } catch {
      // store handles it
    }
  };

  const handleUpvote = async (e, id) => {
    e.stopPropagation();
    await qaStore.upvoteQuestion(id);
  };

  const { questions, pagination, loading, allTags } = qaStore;

  return (
    <div>
      {/* Header */}
      <div className="page-header mb-3">
        <h2>
          <span className="header-icon header-icon-teal me-2">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </span>
          Q&amp;A
        </h2>
        <button className="btn btn-primary btn-sm" onClick={onAsk}>
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Ask Question
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="search-bar mb-3">
        <form onSubmit={handleSearch} className="d-flex gap-2 mb-2">
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              className="form-control"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => { setSearch(''); qaStore.setPage(1); qaStore.fetchQuestions({ search: '', tag: activeTag, status: activeStatus }); }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-sm px-3">
            Search
          </button>
        </form>

        <div className="d-flex gap-2 flex-wrap align-items-center">
          <FontAwesomeIcon icon={faFilter} style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }} />

          {/* Status filter */}
          {['open', 'answered', 'closed'].map((s) => (
            <button
              key={s}
              type="button"
              className={`btn btn-sm ${activeStatus === s ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: '20px' }}
              onClick={() => {
                const next = activeStatus === s ? '' : s;
                setActiveStatus(next);
                qaStore.setPage(1);
                qaStore.fetchQuestions({ search, tag: activeTag, status: next });
              }}
            >
              {s}
            </button>
          ))}

          {/* Tag pills */}
          {allTags.slice(0, 8).map((t) => (
            <button
              key={t}
              type="button"
              className={`btn btn-sm ${activeTag === t ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: '20px' }}
              onClick={() => {
                const next = activeTag === t ? '' : t;
                setActiveTag(next);
                qaStore.setPage(1);
                qaStore.fetchQuestions({ search, tag: next, status: activeStatus });
              }}
            >
              <FontAwesomeIcon icon={faTag} className="me-1" style={{ fontSize: '0.65rem' }} />
              {t}
            </button>
          ))}

          {(search || activeTag || activeStatus) && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-auto"
              style={{ fontSize: '0.78rem' }}
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="mb-2" style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
        {pagination.total} question{pagination.total !== 1 ? 's' : ''}
      </p>

      {/* Loading spinner */}
      {loading && (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!loading && questions.length === 0 && (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <FontAwesomeIcon icon={faQuestionCircle} size="3x" className="text-primary mb-3 d-block mx-auto" />
            <h5 className="mb-1" style={{ color: 'var(--gray-700)' }}>No questions yet</h5>
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
              {search || activeTag || activeStatus
                ? 'Try adjusting your filters'
                : 'Be the first to ask a question!'}
            </p>
            {!search && !activeTag && !activeStatus && (
              <button className="btn btn-primary" onClick={onAsk}>
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Ask Question
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question cards */}
      {!loading &&
        questions.map((q) => (
          <div
            key={q._id}
            className="card shadow-sm mb-3"
            style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
            onClick={() => onSelect(q._id)}
          >
            <div className="card-body">
              <div className="d-flex align-items-start gap-2 mb-1 flex-wrap">
                <span
                  className={`badge ${STATUS_BADGE[q.status] || 'badge-blue'} text-capitalize`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {q.status}
                </span>
                {q.tags.slice(0, 4).map((t) => (
                  <span key={t} className="badge-skill" style={{ fontSize: '0.68rem' }}>
                    {t}
                  </span>
                ))}
              </div>

              <h6 className="fw-semibold mb-1 mt-1" style={{ color: 'var(--gray-800)' }}>
                {q.title}
              </h6>

              <div
                className="d-flex align-items-center gap-3 mt-2 flex-wrap"
                style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn btn-sm btn-action"
                  style={{ height: '26px', width: '26px' }}
                  title="Upvote"
                  onClick={(e) => handleUpvote(e, q._id)}
                >
                  <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: '0.75rem' }} />
                </button>
                <span>{q.upvotes}</span>
                <span>
                  <FontAwesomeIcon icon={faCommentDots} className="me-1" />
                  {(q.answers || []).length}
                </span>
                <span>
                  <FontAwesomeIcon icon={faEye} className="me-1" />
                  {q.views}
                </span>
                <span className="ms-auto">{q.author} · {timeAgo(q.createdAt)}</span>
                <button
                  className="btn btn-sm btn-action btn-action-danger"
                  style={{ height: '26px', width: '26px' }}
                  title="Delete question"
                  onClick={(e) => handleDelete(e, q._id)}
                >
                  <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.75rem' }} />
                </button>
              </div>
            </div>
          </div>
        ))}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <nav aria-label="Q&A pagination" className="mt-3">
          <ul className="pagination pagination-sm justify-content-center flex-wrap gap-1">
            <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => {
                  qaStore.setPage(pagination.page - 1);
                  load({ page: pagination.page - 1 });
                }}
              >
                ‹
              </button>
            </li>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${pagination.page === p ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => {
                    qaStore.setPage(p);
                    load({ page: p });
                  }}
                >
                  {p}
                </button>
              </li>
            ))}
            <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => {
                  qaStore.setPage(pagination.page + 1);
                  load({ page: pagination.page + 1 });
                }}
              >
                ›
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
});

// ─── Main QAPage ─────────────────────────────────────────────────────────────

const QAPage = observer(() => {
  const [view, setView] = useState('list'); // 'list' | 'ask' | 'detail'
  const [selectedId, setSelectedId] = useState(null);

  const goList = () => {
    setView('list');
    setSelectedId(null);
    qaStore.clearError();
  };

  const goDetail = (id) => {
    setSelectedId(id);
    setView('detail');
    qaStore.clearError();
  };

  const goAsk = () => {
    setView('ask');
    qaStore.clearError();
  };

  const handleCreated = (q) => {
    goDetail(q._id);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '760px' }}>
      {view === 'list' && (
        <QuestionList onSelect={goDetail} onAsk={goAsk} />
      )}
      {view === 'ask' && (
        <AskForm onBack={goList} onCreated={handleCreated} />
      )}
      {view === 'detail' && selectedId && (
        <QuestionDetail questionId={selectedId} onBack={goList} />
      )}
    </div>
  );
});

export default QAPage;
