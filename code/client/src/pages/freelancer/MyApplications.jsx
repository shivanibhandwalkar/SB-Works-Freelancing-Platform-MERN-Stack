import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const freelancerId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        // Corrected API endpoint pointing to your backend server port 6001
        const res = await axios.get('http://localhost:6001/fetch-applications');
        const mine = res.data.filter(app => app.freelancerId === freelancerId);
        setApplications(mine);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    
    if (freelancerId) {
      fetchMyApps();
    }
  }, [freelancerId]);

  return (
    <div className="container mt-4">
      <h3>My Submitted Applications</h3>
      <div className="row mt-3">
        {applications.length === 0 ? (
          <p className="text-muted">You haven't applied to any projects yet.</p>
        ) : (
          applications.map(app => (
            <div key={app._id} className="col-md-4 mb-3">
              <div className="card shadow-sm p-3">
                <h5>{app.title}</h5>
                <p className="text-muted small mb-1">Proposed Bid: &#8377;{app.bidAmount}</p>
                <p className="small"><strong>Proposal:</strong> {app.proposal}</p>
                <span className={`badge ${app.status === 'Pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyApplications;