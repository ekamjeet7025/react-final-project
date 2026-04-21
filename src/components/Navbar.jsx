import { NavLink, useNavigate } from 'react-router-dom'
import { FiHome, FiBook, FiCheckSquare, FiRepeat, FiCpu, FiLogOut } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { auth } from '../services/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

   
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })

    return () => unsub()
  }, [])

  // 🔥 Logout
  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="nav-brand">
        <FiCpu className="brand-icon" />
        <span>StudyAI</span>
      </div>

      {/* Links */}
      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiHome /> <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/subjects" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiBook /> <span>Subjects</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiCheckSquare /> <span>Tasks</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/revision" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiRepeat /> <span>Revision</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/ai-tools" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiCpu /> <span>AI Tools</span>
          </NavLink>
        </li>
      </ul>

      {/*  User + Logout */}
      <div style={{ color: "white", marginRight: "20px", textAlign: "right" }}>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          {user?.email}
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "5px",
            background: "transparent",
            border: "none",
            color: "#f87171",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <FiLogOut /> Logout
        </button>
      </div>

    </nav>
  )
}

export default Navbar