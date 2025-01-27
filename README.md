# OnVote

OnVote is a scalable and secure election management system designed to handle multiple elections, ballots, candidates, and voter participation. With a focus on flexibility and data integrity, OnVote ensures smooth and accurate election processes.

Features

	•	Manage Elections: Create and manage multiple elections.
	•	Custom Ballots: Each election supports unique ballots with nested candidates.
	•	Candidate Management: Add, update, and manage candidates specific to each ballot.
	•	Secure Voting: Voters can cast their votes while ensuring a single vote per ballot.
	•	Data Integrity: Prevents ID conflicts across elections, ballots, and candidates.
	•	Scalability: Supports simultaneous elections with separate configurations.

Installation

Prerequisites

Ensure you have the following installed:

	•	Python 3.8+
	•	Flask
	•	Flask-SQLAlchemy
	•	A database (e.g., SQLite, PostgreSQL)

Steps

	1.	Clone the repository:

git clone https://github.com/yourusername/OnVote.git
cd OnVote


	2.	Create a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


	3.	Install dependencies:

pip install -r requirements.txt


	4.	Configure the database:
	•	Edit the database URL in config.py:

SQLALCHEMY_DATABASE_URI = 'sqlite:///onvote.db'  # Replace with your database URL


	5.	Initialize the database:

flask db init
flask db migrate -m "Initial migration"
flask db upgrade


	6.	Run the application:

flask run

The app will be available at http://127.0.0.1:5000.

Usage

API Endpoints

Election Management

	•	Create Election: POST /elections
	•	Get Elections: GET /elections
	•	Get Election by ID: GET /elections/<id>

Ballot Management

	•	Create Ballot: POST /elections/<election_id>/ballots
	•	Get Ballots: GET /elections/<election_id>/ballots

Candidate Management

	•	Add Candidate: POST /elections/<election_id>/ballots/<ballot_id>/candidates
	•	Get Candidates: GET /elections/<election_id>/ballots/<ballot_id>/candidates

Voting

	•	Cast Vote: POST /votes
	•	Get Votes: GET /votes

Database Schema

Tables

	1.	Election: Stores election details.
	2.	Ballot: Represents ballots scoped to specific elections.
	3.	Candidate: Tracks candidates for each ballot.
	4.	Vote: Logs votes cast by voters while ensuring one vote per ballot per voter.

Example Usage

Create an Election

POST /onvote/election/create
{
  "name": "2025 Presidential Election",
  "start_date": "2025-01-01T08:00:00",
  "end_date": "2025-01-15T18:00:00"
}

Add a Ballot

POST /onvote/elections/1/create_ballots
{
  "id": 1,
  "name": "Presidential Ballot"
}

Add a Candidate

POST /onvote/elections/1/create_ballots/1/candidates
{
  "id": 1,
  "name": "Candidate A"
}

Cast a Vote

POST /onvote/votes
{
  "voter_id": "voter123",
  "candidate_id": 1,
  "ballot_id": 1,
  "election_id": 1
}

Technologies Used

	•	Backend: Flask, Flask-SQLAlchemy
	•	Database: SQLite (default), PostgreSQL (optional)
	•	Tools: Alembic for database migrations
	•	Languages: Python

Contributing

Contributions are welcome! To contribute:

	1.	Fork the repository.
	2.	Create a new branch:

git checkout -b feature/your-feature


	3.	Make your changes and commit:

git commit -m "Add your feature"


	4.	Push to your fork and create a pull request.

License

This project is licensed under the GPL License. See the LICENSE file for details.

Contact

For inquiries or support, reach out to:

	•	Name: Praise Aribisala Oluwaseun
	•	Email: aribisalapraise12@gmail.com
