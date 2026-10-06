import React, { useEffect, useState } from 'react';
import '../../styles/admin/allApplications.css';
import axios from 'axios';

const AllApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications");
      setApplications(response.data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="user-applications-page">
      <h3>All Applications</h3>

      <div className="user-applications-body">
        {applications.length === 0 ? (
          <p className="text-muted text-center my-4">No applications found.</p>
        ) : (
          applications.map((application) => (
            <div className="user-application" key={application._id}>
              <div className="user-application-body">
                
                {/* Left Half: Project Info */}
                <div className="user-application-half">
                  <h4>{application.title}</h4>
                  <p>{application.description}</p>
                  <span>
                    <h5>Required Skills</h5>
                    <div className="application-skills">
                      {application.requiredSkills && application.requiredSkills.length > 0 ? (
                        application.requiredSkills.map((skill) => (
                          <p key={skill}>{skill}</p>
                        ))
                      ) : (
                        <p className="text-muted small">None specified</p>
                      )}
                    </div>
                  </span>
                  <h6>Budget - &#8377; {application.budget}</h6>
                  <h5><b>Client: </b> {application.clientName}</h5>
                  <h5><b>Client Id: </b> {application.clientId}</h5>
                  <h5><b>Client email: </b> {application.clientEmail}</h5>
                </div>

                <div className="vertical-line"></div>

                {/* Right Half: Freelancer & Proposal Info */}
                <div className="user-application-half"> 
                  <span>
                    <h5>Proposal</h5>
                    <p>{application.proposal || "No proposal provided."}</p>
                  </span>
                  <span>
                    <h5>Freelancer Skills</h5>
                    <div className="application-skills">
                      {application.freelancerSkills && application.freelancerSkills.length > 0 ? (
                        application.freelancerSkills.map((skill) => (
                          <p key={skill}>{skill}</p>
                        ))
                      ) : (
                        <p className="text-muted small">None specified</p>
                      )}
                    </div>
                  </span>
                  <h6>Proposed Budget - &#8377; {application.bidAmount}</h6>
                  <h5><b>Freelancer: </b> {application.freelancerName}</h5>
                  <h5><b>Freelancer Id: </b> {application.freelancerId}</h5>
                  <h5><b>Freelancer email: </b> {application.freelancerEmail}</h5>
                  <h6>
                    Status: <b style={application.status === "Approved" || application.status === "Accepted" ? { color: "green" } : {}}>
                      {application.status}
                    </b>
                  </h6>
                </div>

              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllApplications;