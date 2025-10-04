# 📌 Helpdesk Management System  

A **full-stack Helpdesk Management System** built with **Flask + MySQL + JavaScript**.  
This project provides a platform for clients to raise support tickets and for admins to manage, resolve, and visualize queries efficiently.  

---

## 🔑 Features  
- :ticket: Client ticket submission (with file upload)  
- :man_technologist: Role-based login system (Admin & Client)  
- :bar_chart: Admin dashboard with **data visualizations**   
- :date: Track ticket status: Open / Closed  
- :chart_with_upwards_trend: Query trend analysis (resolution time, user stats, open vs closed ratio)  
- :art: Responsive admin UI with custom CSS  
- :zap: MySQL database integration  

---

## ⚙️ Tech Stack  

- **Backend:** Flask (Python)  
- **Frontend:** HTML, CSS, Bootstrap, JavaScript  
- **Database:** MySQL  
- **Visualization:** Streamlit for standalone visualization  
- **Authentication:** Flask-Login  

---

## 🔨 Installation & Setup  

### 1. Clone the repository  
```bash
git clone the project
cd into the directory


python -m venv venv
source venv/bin/activate      # On Linux/Mac
venv\Scripts\activate         # On Windows


DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "your_password"
DB_NAME = "arvindsiva"

python .py
python -m streamlit run admin_visualization.py
```
---


## ✅ Features Breakdown

### 👨‍💻 Admin
- View all tickets  
- Change ticket status (Open → Closed)  
- Filter tickets by date/status/user  
- Dashboard with visual reports  

### 👤 Client
- Register/Login  
- Submit tickets with file uploads  
- Track ticket progress  

### 🔒 Security Considerations
- Passwords hashed using **Werkzeug security**  
- File uploads restricted with validation  
- Role-based access control  

### 🧩 Future Enhancements
- Email/SMS notifications for ticket updates  
- Admin team assignment for tickets  
- Export reports as **PDF/Excel**  
- API endpoints for mobile app integration  

### 🤝 Contributing
1. Fork the repository  
2. Create a new branch (`feature/my-feature`)  
3. Commit changes  
4. Push branch  
5. Open a Pull Request  

### 📜 License
This project is licensed under the **GPL 3.0 License** – free to use and modify.  

### 👨‍💻 Author
**Arvind Siva**  


