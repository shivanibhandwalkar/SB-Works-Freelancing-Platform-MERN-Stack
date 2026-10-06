import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/client/client.css'; 

const Client = () => {
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const clientId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await axios.get('http://localhost:6001/fetch-projects');
        // Filter projects created by this specific logged-in client
        const myProjects = projRes.data.filter(p => p.clientId === clientId);
        setProjects(myProjects);

        const appRes = await axios.get('http://localhost:6001/fetch-applications');
        setApplications(appRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };
    fetchData();
  }, [clientId]);

  return (
    <div className="container mt-4">
      {/* 🌟 Interesting Dashboard Header Banner */}
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
        <div className="container-fluid py-2">
          <h1 className="display-6 fw-bold text-primary">Welcome back, {username}! 👋</h1>
          <p className="col-md-8 fs-6 text-muted">
            Manage your posted freelance projects, review incoming bids, and collaborate with top talent in real-time.
          </p>
          <button className="btn btn-dark btn-sm px-4" onClick={() => navigate('/new-project')}>
            + Post New Project
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row text-center mb-4">
        <div className="col-md-6 mb-3">
          <div className="p-3 border bg-white rounded shadow-sm">
            <h5>Total Projects Posted</h5>
            <h3 className="text-success">{projects.length}</h3>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="p-3 border bg-white rounded shadow-sm">
            <h5>Active Applications Received</h5>
            <h3 className="text-info">{applications.filter(app => app.clientId === clientId).length}</h3>
          </div>
        </div>
      </div>

      {/* 📦 Small Box Column Section for Created Projects */}
      <div className="row">
        <div className="col-md-6">
          <h4 className="mb-3">Your Created Projects</h4>
          <div className="border rounded p-3 bg-white shadow-sm" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {projects.length === 0 ? (
              <p className="text-muted text-center my-4">No projects posted yet.</p>
            ) : (
              projects.map(proj => (
                <div key={proj._id} className="card mb-3 p-3 border-start border-primary border-4 shadow-xs">
                  <h5 className="text-dark mb-1">{proj.title}</h5>
                  <p className="text-muted small mb-2">{proj.description.substring(0, 80)}...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary">Budget: &#8377;{proj.budget}</span>
                    <span className="badge bg-success">{proj.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 📋 Incoming Applications Column Box */}
        <div className="col-md-6">
          <h4 className="mb-3">Incoming Applications</h4>
          <div className="border rounded p-3 bg-white shadow-sm" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {applications.filter(app => app.clientId === clientId).length === 0 ? (
              <p className="text-muted text-center my-4">No applications received yet.</p>
            ) : (
              applications
                .filter(app => app.clientId === clientId)
                .map(app => (
                  <div key={app._id} className="card mb-3 p-3 border-start border-info border-4 shadow-xs">
                    <h6 className="fw-bold mb-1">{app.title}</h6>
                    <p className="small mb-1 text-muted"><strong>Freelancer:</strong> {app.freelancerName}</p>
                    <p className="small mb-2"><strong>Bid:</strong> &#8377;{app.bidAmount} | <strong>Proposal:</strong> {app.proposal}</p>
                    <span className="badge bg-warning text-dark w-25">{app.status}</span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;