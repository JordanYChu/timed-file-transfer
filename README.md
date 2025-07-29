
# ⏳ Timed File Transfer

Timed File Transfer is a simple file-sharing platform that allows users to upload files with an expiration time. After the set duration, the files are automatically deleted from the system — saving space, reducing clutter, and encouraging intentional, time-bound sharing.

## 🚀 Features

- 📤 Upload any file with a custom expiration time (e.g., 10 minutes, 24 hours, 3 days)
- 🔒 Secure link generated for each file upload
- 🧹 Automatic background cleanup of expired files
- 🗃️ Metadata stored alongside files for efficient management

## 🧠 Why We Built It

In our day-to-day lives, we often share temporary files but these files tend to linger on devices and servers long after they're needed. This not only wastes space, but also creates unnecessary clutter. Timed File Transfer solves this by giving users the power to set a time limit and automating the cleanup afterward.

## ⚙️ How It Works

1. The user uploads one or more files and selects experation time
2. The server stores the file and metadata
3. The user can choose to share a file tempoarily
4. A background worker system checks for expired files at regular intervals and deletes them from both the database.

## 🧰 Tech Stack
- **Frontend**: CSS, TypeScript, React
- **Backend**: Typescript, NodeJS, ExpressJS
- **Database**: PostgresSQL (managed with Prisma ORM) 
- **Storage**: MinIO (AWS S3 compatible object store)

## 📺 Preview

<img width="1703" height="997" alt="image" src="https://github.com/user-attachments/assets/2b4f4596-e8bb-4fd4-844f-86a03ad3c244" />

