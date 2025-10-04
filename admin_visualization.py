import streamlit as st
import mysql.connector
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

primary_color = '#800040'  # dark magenta for bars
bg_color = '#0f1724'
text_color = '#e6eef6'

sns.set_style('darkgrid')
plt.rcParams.update({
    'text.color': text_color,
    'axes.labelcolor': text_color,
    'xtick.color': text_color,
    'ytick.color': text_color,
    'axes.titlesize': 14,
    'axes.titleweight': 'bold',
    'axes.labelsize': 12,
    'figure.facecolor': bg_color,
    'axes.facecolor': bg_color,
    'savefig.facecolor': bg_color,
    'grid.color': '#444'
})

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "arvindsiva"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

def load_ticket_data():
    conn = get_db_connection()
    df = pd.read_sql("SELECT t.*, u.email AS client_email FROM tickets t LEFT JOIN users u ON t.user_id = u.id", conn)
    conn.close()
    return df

df = load_ticket_data()
if df.empty:
    st.warning("No ticket data found.")
else:
    st.set_page_config(page_title="Admin Visualization Dashboard", layout="wide")
    st.title("Admin Visualization Dashboard")

    # Convert date columns
    df['created_at'] = pd.to_datetime(df['created_at'])
    df['updated_at'] = pd.to_datetime(df['updated_at'])
    df['resolution_hours'] = ((df['updated_at'] - df['created_at']).dt.total_seconds() / 3600).fillna(0)

    # 1. Top 10 Clients by Number of Queries Submitted
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        st.subheader("Top 10 Clients by Number of Queries Submitted")
        top_clients = df['client_email'].value_counts().nlargest(10)
        fig, ax = plt.subplots(figsize=(6, 3))
        ax.bar(top_clients.index, top_clients.values, color=primary_color)
        ax.set_xlabel("Client Mail ID")
        ax.set_ylabel("Number of Queries")
        ax.set_title("Top 10 Clients by Number of Queries Submitted")
        plt.xticks(rotation=20, ha='right')
        st.pyplot(fig, use_container_width=False)

    # 2. Top 10 Most Common Query Types
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        st.subheader("Top 10 Most Common Query Types")
        top_queries = df['subject'].value_counts().nlargest(10)
        fig, ax = plt.subplots(figsize=(6, 3))
        ax.bar(top_queries.index, top_queries.values, color=primary_color)
        ax.set_xlabel("Query Heading")
        ax.set_ylabel("Number of Queries")
        ax.set_title("Top 10 Most Common Query Types")
        plt.xticks(rotation=20, ha='right')
        st.pyplot(fig, use_container_width=False)

    # 3. Top 10 Most Common Open (Backlogged) Query Types
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        st.subheader("Top 10 Most Common Open (Backlogged) Query Types")
        backlogged = df[df['status'].str.lower() == 'open']
        open_counts = backlogged['subject'].value_counts().nlargest(10).sort_values()
        fig, ax = plt.subplots(figsize=(6, 3))
        ax.barh(open_counts.index, open_counts.values, color=primary_color)
        ax.set_xlabel("Number of Open Queries")
        ax.set_ylabel("Query Heading")
        ax.set_title("Top 10 Most Common Open (Backlogged) Query Types")
        st.pyplot(fig, use_container_width=False)

    # 4. Query Status Distribution (Pie Chart)
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        st.subheader("Query Status Distribution")
        status_counts = df['status'].value_counts()
        fig, ax = plt.subplots(figsize=(4, 4))
        colors = ['#800040', '#61040f']
        wedges, texts, autotexts = ax.pie(
            status_counts.values,
            labels=status_counts.index.str.capitalize(),
            colors=colors,
            autopct='%1.1f%%', startangle=140, textprops={'color': text_color}
        )
        ax.set_title("Query Status Distribution")
        st.pyplot(fig, use_container_width=False)

    # 5. Distribution of Query Resolution Time (in Hours)
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        st.subheader("Distribution of Query Resolution Time (in Hours)")
        filtered_res = df[df['resolution_hours'] > 0]
        fig, ax = plt.subplots(figsize=(6, 3))
        ax.hist(filtered_res['resolution_hours'], bins=30, color='#ef4444', edgecolor='black')
        ax.set_xlabel("Resolution Time (Hours)")
        ax.set_ylabel("Number of Queries")
        ax.set_title("Distribution of Query Resolution Time (in Hours)")
        st.pyplot(fig, use_container_width=False)

    # 6. Open vs Closed Queries Per Month
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        st.subheader("Open vs Closed Queries Per Month")
        df['month'] = df['created_at'].dt.to_period('M').astype(str)
        monthly_status = df.groupby(['month', 'status']).size().unstack(fill_value=0)
        monthly_status = monthly_status.sort_index()
        months = list(monthly_status.index)
        closed = monthly_status.get('closed', pd.Series(0, index=months))
        opened = monthly_status.get('open', pd.Series(0, index=months))

        width = 0.35
        fig, ax = plt.subplots(figsize=(6, 3))
        ax.bar(months, closed.values, width, label='Closed', color=primary_color)
        ax.bar(months, opened.values, width, bottom=closed.values, label='Opened', color='#ef4444')
        ax.set_xlabel("Month")
        ax.set_ylabel("Number of Queries")
        ax.set_title("Open vs Closed Queries Per Month")
        ax.legend()
        plt.xticks(rotation=20, ha='right')
        st.pyplot(fig, use_container_width=False)

    # 7. Daily Query Submissions Over Time
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        st.subheader("Daily Query Submissions Over Time")
        daily_submissions = df.groupby(df['created_at'].dt.date).size()
        fig, ax = plt.subplots(figsize=(6, 3))
        ax.plot(daily_submissions.index, daily_submissions.values, marker='o', color=primary_color)
        ax.set_xlabel("Date")
        ax.set_ylabel("Number of Queries")
        ax.set_title("Daily Query Submissions Over Time")
        plt.xticks(rotation=20, ha='right')
        st.pyplot(fig, use_container_width=False)

    # 8. Average Query Resolution Time Over Months
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        st.subheader("Average Query Resolution Time Over Months")
        avg_res_time = df.groupby(df['created_at'].dt.to_period('M'))['resolution_hours'].mean()
        fig, ax = plt.subplots(figsize=(6, 3))
        ax.plot(avg_res_time.index.astype(str), avg_res_time.values, marker='o', color=primary_color)
        ax.set_xlabel("Month")
        ax.set_ylabel("Average Resolution Time (Hours)")
        ax.set_title("Average Query Resolution Time Over Months")
        plt.xticks(rotation=45, ha='right')
        st.pyplot(fig, use_container_width=False)
