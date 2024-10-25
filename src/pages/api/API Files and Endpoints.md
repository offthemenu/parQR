# API Endpoints Documentation

## Overview
This document describes the endpoints used in the parking management app, detailing their purpose, how they function, and key actions they perform.

## **1. cars/add.ts**
### **Purpose**: 
This endpoint is for **adding a new car** to the system.

### **How it Works**:
1. A user sends a `POST` request with details like the car's **license plate**, **model**, and their **user ID**.
2. The server inserts the car's information into the "cars" collection in the database.
3. The user's entry in the "users" collection is updated to include this new car's ID.

### **Key Actions**:
- Adds a new car to the "cars" collection.
- Updates the user's information with the new car's ID.

---

## **2. messages/send.ts**
### **Purpose**: 
This endpoint is for **sending a message** from one user to another about a car.

### **How it Works**:
1. A user sends a `POST` request with details like the **sender's and recipient's user IDs**, the **car's ID**, and the **message content**.
2. The server creates a new message entry in the "messages" collection.
3. The message includes a timestamp of when it was created.

### **Key Actions**:
- Stores the message data in the "messages" collection.

---

## **3. notifications/send.ts**
### **Purpose**: 
This endpoint **sends a notification** to a user’s phone using Twilio (a messaging service).

### **How it Works**:
1. A `POST` request is sent with the recipient's **user ID**.
2. The server fetches the recipient's phone number from the database using their user ID.
3. A predefined message is sent to the user via Twilio.

### **Key Actions**:
- Fetches user details from the database.
- Sends a message to the user’s phone.

---

## **4. qr/verify.ts**
### **Purpose**: 
This endpoint **verifies** a user and their car using a QR code.

### **How it Works**:
1. A `POST` request is sent with a user’s **QR code** and the **last four digits** of a car's license plate.
2. The server checks if the QR code matches a user in the database.
3. It looks at the user’s registered cars and checks if any car has a license plate ending with the provided digits.
4. If there's a match, verification is successful.

### **Key Actions**:
- Confirms the user via QR code.
- Verifies car ownership via license plate.

---

## **5. users/[qr_code].ts**
### **Purpose**: 
This endpoint retrieves information about a **specific user** using their QR code.

### **How it Works**:
1. A request is made with the user's **QR code**.
2. The server fetches the user's details (like their registered cars) from the database.
3. It returns this information to the requester.

### **Key Actions**:
- Fetches and returns user information based on the QR code.

---

## **6. users/register.ts**
### **Purpose**: 
This endpoint is for **registering a new user**.

### **How it Works**:
1. A `POST` request is sent with a **phone number**.
2. The server checks if a user with that phone number already exists.
3. If not, it generates a **QR code** and a **unique user code**.
4. The user’s data (phone number, QR code, user code, etc.) is stored in the "users" collection.
5. A QR code image is created and returned to the user.

### **Key Actions**:
- Generates a QR code for a new user.
- Saves the user’s information in the database.

---

## **How They Connect**
1. **User Registration (`users/register.ts`)**: The entry point for a new user. A QR code and unique user code are generated, and their info is stored.
2. **Car Management (`cars/add.ts`)**: Once registered, users can add cars. The system updates their user profile with car details.
3. **Sending Messages (`messages/send.ts`)**: Users can communicate with each other regarding their cars using this endpoint.
4. **Notifications (`notifications/send.ts`)**: If necessary, the system can send notifications (like reminders to move a car) to users' phones.
5. **QR Code Verification (`qr/verify.ts`)**: Verifies if a user and their car are correctly linked using the QR code system.
6. **User Information Retrieval (`users/[qr_code].ts`)**: Retrieve public user details using their QR code, like which cars they have registered.

---

## **Database Collections Interaction**
### **"users" Collection**:
- Stores user data, including their **phone number**, **QR code**, **user code**, and the **cars** they own.

### **"cars" Collection**:
- Stores individual **car details**, including which user owns the car.

### **"messages" Collection**:
- Contains the communication history between users, associated with specific cars.
