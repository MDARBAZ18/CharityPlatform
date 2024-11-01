CharityPlatform Smart Contract
Introduction
CharityPlatform is a Solidity-based smart contract built to streamline the process of creating, donating to, and managing charity projects on the blockchain. It allows beneficiaries to set up projects with specific funding goals, and donors can contribute directly to these causes, all with complete transparency.

Problem
Fundraising platforms often lack transparency, making it hard for donors to verify if their contributions are used correctly. Traditional systems involve intermediaries, which can delay or complicate the funds’ transfer to beneficiaries.

Solution
With CharityPlatform, beneficiaries and donors interact directly through smart contracts, ensuring:

Transparency: All transactions are publicly recorded on the blockchain.
Direct Donations: Donors contribute directly to specific projects.
Secure Withdrawals: Beneficiaries can withdraw funds only after closing the project.
Refund Option: Donors can request refunds if the project remains open without utilizing donations.
Key Features
Create Project: Beneficiaries can start a fundraising project with a name and funding goal.
Make Donations: Donors can contribute directly to any open project.
Close Project: Beneficiaries can close a project once the goal is met or if they wish to end it.
Withdraw Funds: Beneficiaries withdraw collected funds after the project is closed.
Refund Donations: Donors can request a refund if the project is still open and unutilized.
View Project Details: Anyone can view the project’s details, including the goal and amount raised.
Usage Guide
Creating a Project
To create a project:

Call createProject() with the project’s name and funding goal.
This will set up a new project with the sender as the beneficiary.
Donating to a Project
To donate:

Use donate() and specify the project ID.
Your donation will be added to the project’s funding and recorded under your address.
Managing Projects
Close Project: Beneficiaries can close a project with closeProject() to stop donations once the goal is met.
Withdraw Funds: After closing, beneficiaries can call withdrawFunds() to collect the raised amount.
Request Refund: Donors can call refundDonation() if the project is open and the funds remain unused.
Viewing Details
Use getProjectDetails() to view project info like name, goal, amount raised, and beneficiary.
getDonationAmount() lets you check your donation amount for a specific project.
Events
ProjectCreated: When a new project is initialized.
DonationReceived: When a donation is made to a project.
ProjectClosed: When a project stops accepting donations.
FundsWithdrawn: When funds are collected by the beneficiary.
DonationRefunded: When a donor receives a refund.
Example Workflow
Creating a Project: createProject("Help Build a School", 5000) will create a project.
Making a Donation: Call donate(projectId) and send Ether to support the project.
Closing the Project: Once funded, call closeProject(projectId) to stop further donations.
Withdrawing Funds: Finally, the beneficiary can call withdrawFunds(projectId) to access the raised funds.
Considerations
Only the project’s beneficiary can withdraw funds and close the project.
Donors can get refunds if the project is still open and unused.
Solidity’s built-in checks help prevent overflow errors.
