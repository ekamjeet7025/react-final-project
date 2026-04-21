import { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";

function Tasks() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  // 🔥 Fetch tasks
  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔥 Add task
  const handleAddTask = async () => {
    if (!task) {
      alert("Enter a task");
      return;
    }

    await addDoc(collection(db, "tasks"), {
      title: task,
      status: "Pending",
      userId: user.uid,
      createdAt: new Date()
    });

    setTask("");
    fetchTasks();
  };

  // 🔥 Delete task
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  // 🔥 Complete task
  const handleComplete = async (id) => {
    await updateDoc(doc(db, "tasks", id), {
      status: "Completed"
    });
    fetchTasks();
  };

  // 🔥 Loading UI
  if (loading) {
    return <p style={{ color: "white", padding: "30px" }}>Loading tasks...</p>;
  }

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1 style={{ marginBottom: "20px" }}>Your Tasks</h1>

      {/* Add Task Card */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "25px"
        }}
      >
        <input
          type="text"
          placeholder="Enter a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{
            padding: "10px",
            width: "70%",
            marginRight: "10px",
            borderRadius: "6px",
            border: "none"
          }}
        />

        <button
          onClick={handleAddTask}
          style={{
            padding: "10px 15px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p>No tasks yet 🚀</p>
      ) : (
        tasks.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#1e293b",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  textDecoration:
                    t.status === "Completed" ? "line-through" : "none"
                }}
              >
                {t.title}
              </p>

              <small
                style={{
                  color:
                    t.status === "Completed" ? "#22c55e" : "#facc15"
                }}
              >
                {t.status}
              </small>
            </div>

            <div>
              {t.status !== "Completed" && (
                <button
                  onClick={() => handleComplete(t.id)}
                  style={{
                    marginRight: "10px",
                    background: "#22c55e",
                    border: "none",
                    padding: "6px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  ✔
                </button>
              )}

              <button
                onClick={() => handleDelete(t.id)}
                style={{
                  background: "#ef4444",
                  border: "none",
                  padding: "6px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                ❌
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;