![image](https://github.com/user-attachments/assets/3a1f0594-86b4-41be-a80b-15f0306618d4)

---

### **📸 Photo AI - AI-Powered Photo Generation**  
Photo AI helps you create stunning, AI-enhanced portraits effortlessly. Turn any photo into a masterpiece with our advanced AI technology.

---

## 🚀 **Tech Stack**  
### **Frontend**  
- **Next.js 14** (App Router)  
- **TypeScript**  
- **Tailwind CSS**  
- **S3** (for storing model images)  

### **Backend**  
- **Node.js** with TypeScript  

### **Authentication**  
- **Clerk**  

### **Infrastructure**  
- **Docker** (Containerization)  
- **Bun** (Package Management)  
- **Turborepo** (Monorepo Management)  

---

## 📂 **Project Structure**  

```
.
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── backend/             # Node.js backend (Bun)
├── packages/
│   ├── db/                  # Shared database utilities
│   ├── typescript-config/   # Shared TypeScript config
│   ├── eslint-config/       # Shared ESLint config
├── docker/
│   ├── Dockerfile.frontend  # Frontend Docker configuration
│   ├── Dockerfile.backend   # Backend Docker configuration
└── package.json
```

---

## 🛠 **Setup & Local Development**  

### **1️⃣ Install Dependencies**  
```sh
bun install
```

### **2️⃣ Run Development Servers**  
```sh
bun run dev
```

### **3️⃣ Build All Packages**  
```sh
bun run build
```

---

## 📌 **Development Commands**  

| Command                | Description                          |
|------------------------|--------------------------------------|
| `bun run start:web`    | Run **frontend only** (Next.js)      |
| `bun run start:backend` | Run **backend only** (Node.js)      |
| `bun run dev`          | Run **both frontend & backend**     |

## 🎯 **Contributing**  
1. **Fork the repository**  
2. **Create a new branch** (`feature/new-feature`)  
3. **Commit your changes** (`git commit -m "Add new feature"`)  
4. **Push to the branch** (`git push origin feature/new-feature`)  
5. **Submit a Pull Request** 🚀  

---

## 📜 **License**  
This project is licensed under the **MIT License**.  

---
