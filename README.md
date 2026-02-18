# AM308S: LoRaWAN Sensor Data API

A robust backend service designed to ingest, process, and store telemetry data from LoRaWAN-enabled sensors. This project serves as the foundation for a future web-based data visualization platform.

---

## 📌 Project Overview
The **AM308S** project is an end-to-end IoT solution focused on long-range, low-power data collection. The server acts as the bridge between the LoRaWAN Network Server (LNS) and the end-user application.

* **Primary Goal:** Reliability and data integrity for remote sensor monitoring.
* **Protocol:** LoRaWAN (Class A/C devices).
* **Architecture:** Uplink Decoding -> Data Validation -> Persistence -> REST API.

---

## 🛠 Tech Stack
* **Backend:** [e.g., Node.js / Python / Go]
* **Database:** [e.g., PostgreSQL / InfluxDB / MongoDB]
* **Network Server:** [e.g., The Things Network (TTN) / ChirpStack]
* **Payload Format:** JSON (Base64 decoded)

---

## 📂 Project Structure
```text
├── src/
│   ├── controllers/    # API Route handlers
│   ├── models/         # Database schemas (Sensor, Uplink, Device)
│   ├── services/       # LoRaWAN payload decoding logic
│   └── utils/          # Formatting and validation helpers
├── docs/               # API documentation & sensor specs
├── tests/              # Unit tests for payload decoders
├── .env.example        # Template for environment variables
└── README.md
