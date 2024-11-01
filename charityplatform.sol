// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityPlatform {
    // Project structure
    struct Project {
        string name;              // Project name
        address payable beneficiary; // Project beneficiary
        uint256 goalAmount;       // Goal amount for the project
        uint256 currentAmount;    // Current raised amount
        bool isOpen;              // Whether the project is open for donations
    }

    // Mapping from project ID to donor address to donation amount
    mapping(uint256 => mapping(address => uint256)) public donations;

    // List of projects
    Project[] public projects;

    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed beneficiary, uint256 goalAmount, string name);
    event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount);
    event ProjectClosed(uint256 indexed projectId);
    event FundsWithdrawn(uint256 indexed projectId, address indexed beneficiary, uint256 amount);
    event DonationRefunded(uint256 indexed projectId, address indexed donor, uint256 amount);

    // Modifier to ensure that the sender is the beneficiary of the project
    modifier onlyBeneficiary(uint256 projectId) {
        require(msg.sender == projects[projectId].beneficiary, "Only the beneficiary can perform this action");
        _;
    }

    // Modifier to ensure that the project exists and is open
    modifier projectExists(uint256 projectId) {
        require(projectId < projects.length, "Project does not exist");
        require(projects[projectId].isOpen, "Project is closed");
        _;
    }

    // Create a new project
    function createProject(string memory _name, uint256 _goalAmount) external {
        Project memory newProject = Project({
            name: _name,
            beneficiary: payable(msg.sender),
            goalAmount: _goalAmount,
            currentAmount: 0,
            isOpen: true
        });
        projects.push(newProject);
        emit ProjectCreated(projects.length - 1, msg.sender, _goalAmount, _name);
    }

    // Donate to a project
    function donate(uint256 _projectId) external payable projectExists(_projectId) {
        require(msg.value > 0, "Donation amount must be greater than 0");

        donations[_projectId][msg.sender] += msg.value;
        projects[_projectId].currentAmount += msg.value;

        emit DonationReceived(_projectId, msg.sender, msg.value);
    }

    // Close a project
    function closeProject(uint256 _projectId) external onlyBeneficiary(_projectId) projectExists(_projectId) {
        projects[_projectId].isOpen = false;
        emit ProjectClosed(_projectId);
    }

    // Withdraw funds from a closed project
    function withdrawFunds(uint256 _projectId) external onlyBeneficiary(_projectId) {
        require(!projects[_projectId].isOpen, "Project must be closed before withdrawing funds");

        uint256 amount = projects[_projectId].currentAmount;
        require(amount > 0, "No funds to withdraw");

        projects[_projectId].currentAmount = 0;
        payable(msg.sender).transfer(amount);

        emit FundsWithdrawn(_projectId, msg.sender, amount);
    }

    // Refund a donation
    function refundDonation(uint256 _projectId) external projectExists(_projectId) {
        uint256 amount = donations[_projectId][msg.sender];
        require(amount > 0, "No donations to refund");

        donations[_projectId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit DonationRefunded(_projectId, msg.sender, amount);
    }

    // Get project details
    function getProjectDetails(uint256 _projectId) external view projectExists(_projectId) returns (
        string memory name,
        address payable beneficiary,
        uint256 goalAmount,
        uint256 currentAmount,
        bool isOpen
    ) {
        Project storage project = projects[_projectId];
        return (project.name, project.beneficiary, project.goalAmount, project.currentAmount, project.isOpen);
    }

    // Get donation amount by a specific donor for a project
    function getDonationAmount(uint256 _projectId, address _donor) external view projectExists(_projectId) returns (uint256) {
        return donations[_projectId][_donor];
    }
}
