import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/items`);

      if (!response.ok) {
        throw new Error("Failed to load items");
      }

      const data = await response.json();

      setItems(data);
    } catch (error) {
      Sentry.captureException(error);
      setMessage("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  const saveItem = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage("Please enter both title and content.");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/api/items/${editingId}`
        : `${API_URL}/api/items`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save item");
      }

      await loadItems();

      setMessage(
        editingId
          ? "Note updated successfully."
          : "Note created successfully."
      );

      resetForm();
    } catch (error) {
      Sentry.captureException(error);
      setMessage("Unable to save note.");
    }
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteItem = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/items/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      await loadItems();

      setMessage("Note deleted successfully.");
    } catch (error) {
      Sentry.captureException(error);
      setMessage("Unable to delete note.");
    }
  };

  /*
   * v1.0.0:
   * Intentional unhandled frontend exception.
   */
  const triggerUnhandledFrontendError = () => {
    throw new Error(
      "Intentional Unhandled Frontend Exception!"
    );
  };

  /*
   * v1.1.0:
   * Intentional handled exception.
   */
  const triggerHandledError = () => {
    try {
      throw new Error(
        "Intentional Handled Frontend Error!"
      );
    } catch (error) {
      Sentry.captureException(error);

      setMessage(
        "Handled error sent to Sentry successfully."
      );
    }
  };

  /*
   * Generate backend error for alert testing.
   */
  const triggerBackendError = async () => {
    try {
      await fetch(
        `${API_URL}/api/sentry/error`
      );

      setMessage(
        "Backend error request sent."
      );
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  /*
   * Trigger backend unhandled async rejection.
   */
  const triggerBackendAsyncError = async () => {
    try {
      await fetch(
        `${API_URL}/api/sentry/unhandled-async`
      );

      setMessage(
        "Backend async error triggered."
      );
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">
            DEVOPS • RELEASE MONITORING
          </p>

          <h1>Release Health Monitor</h1>

          <p className="subtitle">
            Full-stack CRUD application with Sentry
            release tracking and error monitoring.
          </p>
        </div>

        <div className="release-card">
          <span>Current Release</span>

          <strong>
            {import.meta.env.VITE_SENTRY_RELEASE}
          </strong>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <h2>
            {editingId
              ? "Edit Note"
              : "Create Note"}
          </h2>

          <form onSubmit={saveItem}>
            <label>
              Title
              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter note title"
              />
            </label>

            <label>
              Content
              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Enter note content"
                rows="5"
              />
            </label>

            <div className="form-actions">
              <button
                className="primary"
                type="submit"
              >
                {editingId
                  ? "Update Note"
                  : "Create Note"}
              </button>

              {editingId && (
                <button
                  className="secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}
        </section>

        <section className="card">
          <div className="section-header">
            <div>
              <p className="eyebrow">
                CRUD
              </p>

              <h2>Your Notes</h2>
            </div>

            <span className="count">
              {items.length} items
            </span>
          </div>

          {loading ? (
            <p>Loading notes...</p>
          ) : items.length === 0 ? (
            <p className="empty">
              No notes available.
            </p>
          ) : (
            <div className="items">
              {items.map((item) => (
                <article
                  className="item"
                  key={item.id}
                >
                  <div className="item-content">
                    <h3>{item.title}</h3>

                    <p>{item.content}</p>

                    <small>
                      Item #{item.id}
                    </small>
                  </div>

                  <div className="item-actions">
                    <button
                      className="secondary"
                      onClick={() =>
                        editItem(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="danger"
                      onClick={() =>
                        deleteItem(item.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="card monitoring">
          <div className="section-header">
            <div>
              <p className="eyebrow">
                SENTRY
              </p>

              <h2>Monitoring Controls</h2>
            </div>
          </div>

          <p>
            These controls are included to verify
            Sentry errors across application releases.
          </p>

          <div className="monitor-grid">
            <button
              className="danger"
              onClick={
                triggerUnhandledFrontendError
              }
            >
              Unhandled Frontend Error
            </button>

            <button
              className="warning"
              onClick={
                triggerHandledError
              }
            >
              Handled Frontend Error
            </button>

            <button
              className="danger"
              onClick={
                triggerBackendError
              }
            >
              Backend Error
            </button>

            <button
              className="warning"
              onClick={
                triggerBackendAsyncError
              }
            >
              Backend Async Error
            </button>
          </div>
        </section>
      </main>

      <footer>
        Release Health Monitor • Sentry Integration
      </footer>
    </div>
  );
}

export default App;