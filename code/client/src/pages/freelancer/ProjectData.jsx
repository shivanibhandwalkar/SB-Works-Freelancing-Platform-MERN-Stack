import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/freelancer/ProjectData.css';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const freelancerId = localStorage.getItem('userId');
  const freelancerName = localStorage.getItem('username');
  const freelancerEmail = localStorage.getItem('email');

  useEffect(() => {
    fetchProject(params['id']);
  }, [params['id']]);

  const fetchProject = async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-projects`);
      const found = response.data.find(p => p._id === id);
      setProject(found);
    } catch (err) {
      console.log("Error fetching project details:", err);
    }
  };

  // 🚀 This function triggers when you click the Apply button
  const handleApply = async () => {
    if (!proposal || !bidAmount) {
      alert("Please fill in your proposal and proposed bid amount!");
      return;
    }

    try {
      const applicationData = {
        projectId: project._id,
        clientId: project.clientId,
        clientName: project.clientName,
        clientEmail: project.clientEmail,
        freelancerId,
        freelancerName,
        freelancerEmail,
        title: project.title,
        description: project.description,
        budget: project.budget,
        proposal,
        bidAmount: Number(bidAmount),
        estimatedTime,
        requiredSkills: project.skills || [],
        freelancerSkills: ["React", "Node.js", "MongoDB"]
      };

      await axios.post("http://localhost:6001/new-application", applicationData);
      alert("Application submitted successfully!");
      navigate('/myApplications'); // Instantly redirects to show it on your frontend tabs
    } catch (err) {
      console.error("Failed to submit application:", err);
      alert("Error submitting application. Try again!");
    }
  };

  if (!project) return <div className="container mt-5">Loading project details...</div>;

  return (
    <div className="project-data-page container mt-4">
      <div className="card shadow-sm p-4 mb-4">
        <h3>{project.title}</h3>
        <p className="text-muted">{project.description}</p>
        <div className="mb-3">
          <strong>Required Skills:</strong> {project.skills?.join(', ')}
        </div>
        <h5>Budget: &#8377; {project.budget}</h5>
      </div>

      {/* 🎯 Proposal Form & Apply Button on Frontend */}
      {project.status === "Available" && (
        <div className="card shadow-sm p-4 bg-light">
          <h4>Send Proposal & Apply</h4>
          
          <div className="mb-3">
            <label className="form-label">Proposed Budget (in &#8377;)</label>
            <input 
              type="number" 
              className="form-control" 
              value={bidAmount} 
              onChange={(e) => setBidAmount(e.target.value)} 
              placeholder="e.g. 5000"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Estimated Time (days)</label>
            <input 
              type="number" 
              className="form-control" 
              value={estimatedTime} 
              onChange={(e) => setEstimatedTime(e.target.value)} 
              placeholder="e.g. 7"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Describe your proposal</label>
            <textarea 
              className="form-control" 
              rows="3"
              value={proposal} 
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Write why you are a great fit..."
            />
          </div>

          {/* The actual Apply button rendered on your website UI */}
          <button className="btn btn-success px-4" onClick={handleApply}>
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectData;