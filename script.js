// Sample Security Logs Dataset with Forensic Insights
const logsData = [
    {
        "timestamp": "2026-08-27 10:14:02", 
        "source_ip": "192.168.1.105", 
        "dest_port": 22, 
        "event_type": "SSH Brute Force", 
        "severity": "High", 
        "action": "Blocked",
        "details": "Multiple failed SSH authentication attempts detected within 10 seconds. Automated IP ban triggered.",
        "remediation": "Block IP permanently via Firewall rules & enforce SSH Key Authentication."
    },
    {
        "timestamp": "2026-08-27 10:15:11", 
        "source_ip": "10.0.0.42", 
        "dest_port": 80, 
        "event_type": "SQL Injection Attempt", 
        "severity": "Critical", 
        "action": "Blocked",
        "details": "Payload containing 'UNION SELECT' detected in HTTP GET query parameter.",
        "remediation": "Sanitize user inputs & implement Parameterized Queries (Prepared Statements)."
    },
    {
        "timestamp": "2026-08-27 10:18:45", 
        "source_ip": "192.168.1.120", 
        "dest_port": 443, 
        "event_type": "Successful Login", 
        "severity": "Low", 
        "action": "Allowed",
        "details": "Authorized user 'h_alhajji' logged in successfully via HTTPS.",
        "remediation": "No remediation needed. Monitor for anomalous location logins."
    },
    {
        "timestamp": "2026-08-27 10:22:00", 
        "source_ip": "45.33.32.156", 
        "dest_port": 8080, 
        "event_type": "Directory Traversal", 
        "severity": "Medium", 
        "action": "Blocked",
        "details": "Path traversal pattern ('../../etc/passwd') blocked by Web Application Firewall (WAF).",
        "remediation": "Disable directory listing & configure proper web server permission access."
    },
    {
        "timestamp": "2026-08-27 10:25:33", 
        "source_ip": "192.168.1.105", 
        "dest_port": 22, 
        "event_type": "SSH Brute Force", 
        "severity": "High", 
        "action": "Blocked",
        "details": "Repeated login failure under account 'admin'.",
        "remediation": "Disable root/admin remote logins over SSH."
    },
    {
        "timestamp": "2026-08-27 10:30:12", 
        "source_ip": "185.220.101.5", 
        "dest_port": 443, 
        "event_type": "Port Scan Detected", 
        "severity": "Medium", 
        "action": "Logged",
        "details": "Sequential SYN packet scans targeting multiple open ports.",
        "remediation": "Configure IDS/IPS rate-limiting rules for port scanning."
    },
    {
        "timestamp": "2026-08-27 10:31:05", 
        "source_ip": "185.220.101.5", 
        "dest_port": 445, 
        "event_type": "SMB Exploit Attempt", 
        "severity": "Critical", 
        "action": "Blocked",
        "details": "EternalBlue (MS17-010) exploit signature matched during packet inspection.",
        "remediation": "Disable SMBv1 network-wide and apply critical Windows patches."
    },
    {
        "timestamp": "2026-08-27 10:35:40", 
        "source_ip": "10.0.0.15", 
        "dest_port": 443, 
        "event_type": "Successful Login", 
        "severity": "Low", 
        "action": "Allowed",
        "details": "Analyst session created successfully.",
        "remediation": "Regular session timeout enforcement."
    }
];

// Initialize Dashboard & Dynamic Rendering
document.addEventListener('DOMContentLoaded', () => {
    const totalElem = document.getElementById('stat-total');
    if(totalElem) {
        // Update Stats Values
        totalElem.innerText = logsData.length;
        document.getElementById('stat-critical').innerText = logsData.filter(l => l.severity === 'Critical' || l.severity === 'High').length;
        document.getElementById('stat-blocked').innerText = logsData.filter(l => l.action === 'Blocked').length;

        // Render Initial Table Logs
        renderLogsTable(logsData);

        // Search & Filter Listeners
        const searchInput = document.getElementById('logSearchInput');
        const severityFilter = document.getElementById('severityFilter');

        function filterData() {
            const query = searchInput.value.toLowerCase().trim();
            const selectedSev = severityFilter.value;

            const filtered = logsData.filter(log => {
                const matchesSearch = 
                    log.source_ip.toLowerCase().includes(query) ||
                    log.event_type.toLowerCase().includes(query) ||
                    log.action.toLowerCase().includes(query) ||
                    log.dest_port.toString().includes(query) ||
                    log.timestamp.includes(query) ||
                    log.severity.toLowerCase().includes(query);

                const matchesSev = (selectedSev === 'ALL') || (log.severity === selectedSev);

                return matchesSearch && matchesSev;
            });

            renderLogsTable(filtered);
        }

        searchInput.addEventListener('input', filterData);
        severityFilter.addEventListener('change', filterData);

        // Render Charts
        new Chart(document.getElementById('severityChart'), {
            type: 'doughnut',
            data: {
                labels: ['Critical', 'High', 'Medium', 'Low'],
                datasets: [{
                    data: [2, 2, 2, 2],
                    backgroundColor: ['#ef4444', '#f59e0b', '#eab308', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: { plugins: { legend: { labels: { color: '#94a3b8' } } } }
        });

        new Chart(document.getElementById('attackTypeChart'), {
            type: 'bar',
            data: {
                labels: ['SSH Brute Force', 'SQL Injection', 'Directory Traversal', 'Port Scan', 'SMB Exploit'],
                datasets: [{
                    label: 'Occurrences',
                    data: [2, 1, 1, 1, 1],
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                scales: {
                    x: { ticks: { color: '#94a3b8' } },
                    y: { ticks: { color: '#94a3b8' } }
                },
                plugins: { legend: { labels: { color: '#94a3b8' } } }
            }
        });
    }
});

// Render Dynamic Table Rows
function renderLogsTable(data) {
    const tbody = document.getElementById('logTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding: 20px;">No matching log events found.</td></tr>`;
        return;
    }

    data.forEach((log) => {
        let sevColor = log.severity === 'Critical' ? '#ef4444' : log.severity === 'High' ? '#f59e0b' : log.severity === 'Medium' ? '#eab308' : '#10b981';
        
        let row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.title = 'Click to inspect threat analysis';
        row.innerHTML = `
            <td>${log.timestamp}</td>
            <td class="ip-highlight">${log.source_ip}</td>
            <td>${log.dest_port}</td>
            <td>${log.event_type}</td>
            <td style="color: ${sevColor}; font-weight: bold;">${log.severity}</td>
            <td>${log.action} <i class="fa-solid fa-chevron-right" style="font-size:0.7rem; opacity:0.5; margin-left:5px;"></i></td>
        `;

        row.addEventListener('mouseenter', () => row.style.backgroundColor = 'rgba(16, 185, 129, 0.08)');
        row.addEventListener('mouseleave', () => row.style.backgroundColor = 'transparent');
        row.addEventListener('click', () => showLogDetails(log));

        tbody.appendChild(row);
    });
}

// Modal Logic
function showLogDetails(log) {
    const modal = document.getElementById('logModal');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
        <p><strong>[+] Event:</strong> ${log.event_type}</p>
        <p><strong>[+] Source IP:</strong> <span style="color:#38bdf8">${log.source_ip}</span> (Port: ${log.dest_port})</p>
        <p><strong>[+] Severity:</strong> <span style="color:${log.severity === 'Critical' ? '#ef4444' : log.severity === 'High' ? '#f59e0b' : '#10b981'}">${log.severity}</span></p>
        <p><strong>[+] SIEM Action:</strong> ${log.action}</p>
        <hr style="border:0; border-top:1px solid var(--border); margin:10px 0;">
        <p style="color:#94a3b8;"><strong>Analysis / Trigger:</strong><br>${log.details}</p>
        <p style="color:#10b981; margin-top:8px;"><strong>Recommended SOC Action:</strong><br>${log.remediation}</p>
    `;

    modal.style.display = 'flex';
}

// Close Modal Controls
document.addEventListener('click', (e) => {
    const modal = document.getElementById('logModal');
    const closeBtn = document.getElementById('closeModal');
    if (e.target === modal || e.target === closeBtn) {
        modal.style.display = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Hide Cyber Loader on Page Load
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('cyber-loader');
        if (loader) {
            loader.classList.add('loader-hidden');
        }
    }, 2200);
});
