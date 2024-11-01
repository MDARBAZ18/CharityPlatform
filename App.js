import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CharityPlatformABI from './contracts/CharityPlatformABI.json';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer'; // Import the Footer component

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = new Web3(new Web3.providers.HttpProvider('https://rpc.cardona.zkevm-rpc.com'));
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        console.log('Network ID:', networkId);

        const deployedNetwork = CharityPlatformABI.networks[networkId];
        if (deployedNetwork) {
          const contractInstance = new web3Instance.eth.Contract(CharityPlatformABI.abi, deployedNetwork.address);
          setContract(contractInstance);
          console.log('Contract Instance:', contractInstance);
          console.log('Contract Methods:', Object.keys(contractInstance.methods));
        } else {
          console.error('Contract not deployed on this network');
        }
      } catch (error) {
        console.error('Error initializing Web3 or contract:', error);
      }
    };

    initWeb3();
  }, []);

  const handleProjectIdChange = (event) => {
    setProjectId(event.target.value);
  };

  const fetchProjectDetails = async () => {
    if (contract && projectId) {
      try {
        console.log('Fetching project details for ID:', projectId);

        if (contract.methods.getProjectDetails) {
          const details = await contract.methods.getProjectDetails(projectId).call();
          console.log('Fetched project details:', details);

          if (details && details.name && details.beneficiary && details.goalAmount && details.currentAmount && typeof details.isOpen !== 'undefined') {
            setProjectDetails({
              name: details.name,
              beneficiary: details.beneficiary,
              goalAmount: details.goalAmount,
              currentAmount: details.currentAmount,
              isOpen: details.isOpen
            });
          } else {
            console.error('No details returned or details are in an unexpected format:', details);
          }
        } else {
          console.error('getProjectDetails method is not found on contract');
        }
      } catch (error) {
        console.error('Error fetching project details:', error.message);
      }
    } else {
      console.error('Contract instance is not initialized or project ID is missing');
    }
  };

  // Custom component to conditionally render the footer
  const FooterWrapper = () => {
    const location = useLocation();
    return location.pathname !== '/' ? <Footer /> : null;
  };

  return (
    <ErrorBoundary>
      <Router>
        <nav className="navbar">
          <img src="/images/charitylogo.jpeg" alt="Charity Platform Logo" />
          <div>
            <a href="/">Home</a>
            <a href="/project">Project Details</a>
            <a href="/about">About Us</a>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/project"
            element={
              <div className="project-container">
                <input
                  type="number"
                  value={projectId}
                  onChange={handleProjectIdChange}
                  placeholder="Enter Project ID"
                  className="input-search"
                />
                <button onClick={fetchProjectDetails} className="fetch-button">Get Project Details</button>
                {projectDetails && (
                  <div className="project-details-card no-repeat-background">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk6TMubPc1lORafJN7gQ7cslohlqJkJ47NCA&s" />
                    <h2>Project Details</h2>
                    <div className="detail-item">
                      <strong>Name:</strong>
                      <span className="detail-value">{projectDetails.name}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Beneficiary:</strong>
                      <span className="detail-value">{projectDetails.beneficiary}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Goal Amount:</strong>
                      <span className="detail-value">{web3.utils.fromWei(projectDetails.goalAmount, 'ether')} ETH</span>
                    </div>
                    <div className="detail-item">
                      <strong>Current Amount:</strong>
                      <span className="detail-value">{web3.utils.fromWei(projectDetails.currentAmount, 'ether')} ETH</span>
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong>
                      <span className="detail-value">{projectDetails.isOpen ? 'Open' : 'Closed'}</span>
                    </div>
                  </div>
                )}
              </div>
            }
          />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
        <FooterWrapper /> {/* Conditionally render the footer */}
      </Router>
    </ErrorBoundary>
  );
};

export default App;
