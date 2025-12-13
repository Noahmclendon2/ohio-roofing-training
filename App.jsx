import React, { useState } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [announcement, setAnnouncement] = useState(
    "Welcome to All Ohio Roofing Training Portal"
  );

  async function login() {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const ref = doc(db, "users", res.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          email,
          revenue: 0,
          xp: 0,
          role: "rep",
        });
      }

      setUser(res.user);
    } catch (err) {
      alert("Login failed. Check email/password.");
    }
  }

  function logout() {
    signOut(auth);
    setUser(null);
  }

  const courses = [
    {
      title: "Daily Motivation",
      video: "https://www.youtube.com/embed/zf0KZlHyJDQ",
    },
    {
      title: "Roof Inspection",
      video: "https://www.youtube.com/embed/zXLGnIpa2vA",
    },
    {
      title: "Sales Pitch",
      video: "https://www.youtube.com/embed/FqmfjNJB4tE",
    },
    {
      title: "Repair Attempt",
      video: "https://www.youtube.com/embed/SeGxoy2bazc",
    },
  ];

  return (
    <div style={{ background: "#0f0f0f", color: "white", minHeight: "100vh", padding: 20 }}>
      <h1>All Ohio Roofing LMS</h1>

      {!user ? (
        <div>
          <h3>Rep Login</h3>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <>
          <p>{announcement}</p>
          <button onClick={logout}>Logout</button>

          <h2>Training Videos</h2>
          {courses.map((c) => (
            <div key={c.title} style={{ marginBottom: 30 }}>
              <h3>{c.title}</h3>
              <iframe
                width="100%"
                height="315"
                src={c.video}
                title={c.title}
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
