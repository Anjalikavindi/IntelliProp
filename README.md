# IntelliProp: AI-Driven Property Marketplace

IntelliProp is a modern "PropTech" ecosystem designed to modernize the Sri Lankan real estate market. Moving beyond traditional passive listing sites, IntelliProp integrates Machine Learning for automated property valuation, Content-Based Filtering for house recommendations and an AI Chatbot for seamless user interaction.

# 🌟 Key Features

## 🏠 For Buyers

1. Intelligent Recommendations: Get house suggestions based on property features using our KNN-based recommendation engine.

<img width="1898" height="867" alt="image" src="https://github.com/user-attachments/assets/fcd6d172-074c-43b3-8c33-ca3ca95a6bf4" />	
	
.

2. Live Land Auctions: Participate in competitive bidding with real-time countdown timers.
<img width="1902" height="868" alt="image" src="https://github.com/user-attachments/assets/a9c1955a-e45b-49fc-9a53-fb52f46703ff" />

.

3. Automated Winner Notifications: Receive an instant email confirmation the moment an auction ends if you are the highest bidder.
<img width="1920" height="644" alt="Email_sent_to_buyer" src="https://github.com/user-attachments/assets/9253b3d3-34ce-45b6-9e48-9a08bdeec5d0" />

.

4. Advanced Filtering: Search properties by district, area, price and land type.
<img width="1920" height="4606" alt="screencapture-localhost-3000-lands-2026-03-07-13_39_00" src="https://github.com/user-attachments/assets/66906c23-ca35-4769-ae93-03d7a731c025" />

.   

5. Interactive Chatbot: Get instant answers and guidance via the integrated Gemini-powered AI agent.
<img width="1902" height="869" alt="image" src="https://github.com/user-attachments/assets/73b7f5ca-c5df-40ee-b65b-dcc8ad157efa" />

.

## 📢 For Sellers

1. Automated Valuation: Explore predicted house prices based on market data before advertising.
<img width="1902" height="869" alt="image" src="https://github.com/user-attachments/assets/d7485671-ad89-4659-ba60-64cb1ecea6ba" />

.

2. Auction Closure Emails: Receive automated summaries including the final winning bid and buyer contact details as soon as your land auction expires.
<img width="1920" height="643" alt="Email_to_Seller" src="https://github.com/user-attachments/assets/c6777530-16c2-4bf5-bb94-4f7d01f41144" />

.

3. Secure Ad Management: Verified email profiles to ensure trust and data integrity.
<img width="1920" height="2247" alt="screencapture-localhost-3000-verifyyournumber-2026-03-07-13_40_38" src="https://github.com/user-attachments/assets/21d0c877-f8c7-42cb-9f06-8021db2d78eb" />

.

4. Customizable Auctions: Set specific end dates and starting prices for land ads.
<img width="1900" height="869" alt="image" src="https://github.com/user-attachments/assets/c836bb9d-3164-40f6-b521-eaff3cda6a54" />

.

## 🛡️ For Administration

1. Ad Moderation: Review, publish or remove house and land advertisements.
<img width="1900" height="868" alt="image" src="https://github.com/user-attachments/assets/a6190f09-ea48-4d60-8197-3223c0916698" />

.

<img width="1900" height="869" alt="image" src="https://github.com/user-attachments/assets/570013a9-92d3-4c4c-b481-19e63e82a3bf" />

.

2. Auction Control: Manage active/inactive statuses of bidding sessions.
<img width="1902" height="868" alt="image" src="https://github.com/user-attachments/assets/b64916d3-432c-44ac-9ecb-1ad5868e80fb" />

.

3. User Management: Oversee registered users and system integrity.
<img width="1898" height="867" alt="image" src="https://github.com/user-attachments/assets/a97cf808-bb57-489b-9f80-4c972ee0eb1f" />

.

## 📈 System Architecture

The project follows a decoupled architecture where the Node.js API handles business logic and auction timers, while the Flask ML-Service handles high-compute tasks like price prediction and recommendation processing.

## 🚀 Getting Started

### Prerequisites

Node.js (v16+)

Python (3.9+)

MySQL Server

### 🛠️ Installation

#### 1. Backend (Node.js)

cd webbackend

npm install

// Configure your .env file (PORT, DB_HOST, EMAIL_USER, etc.)

npm start

#### 2. ML-Service (Flask)

cd ml-service

pip install -r requirements.txt

// Add your GEMINI_API_KEY to the .env file

python app.py

#### 3. Frontend (React)

cd frontend

npm install

npm run dev
