# User Collections Project - Backend

This project is a part of an internship program with "Intransition".

## Backend Features

- **User Registration:** Enables user account creation.
- **Collection Management:** Users can create, edit, and delete collections and add items. Markdown formatting is supported for descriptions, with security measures on both front-end and back-end.
- **Administrator and Root User Roles:**
  - **Administrator:** Can view and manage all collections and items, block, unblock, and delete users.
  - **Root User:** Inherits all administrator privileges, plus can manage other administrators. Cannot be blocked or deleted.
- **Full-Text Item Search:** Allows searching items by content.
- **Tag Cloud:** Returns tags with the highest request count in searches plus item count.
- **AWS Bucket Integration:** For photo uploads.
- **Aggregation and Transactions:** Implements MongoDB aggregation and transactions for data consistency and integrity.
- **Deployment:** Hosted on onRender.com.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
