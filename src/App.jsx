import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [website, setWebsite] = useState("");
  const [ipAddresses, setIpAddresses] = useState([]);
  const [ipInfo, setIpInfo] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `https://dns.google/resolve?name=${website}`
      );
      const ips = data.Answer.map((entry) => entry.data);

      setIpAddresses(ips);
      const infoPromises = ips.map((ip) =>
        axios.get(`https://ipinfo.io/${ip}/json`)
      );
      const infoResponses = await Promise.all(infoPromises);
      const infoData = infoResponses.map((response) => response.data);
      setIpInfo(infoData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container">
      <h1>Website IP Info</h1>
      <form onSubmit={handleSubmit}>
        <div className="inputcontainer">
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Enter website/domain"
          required
        />
        {website && (
          <button
            type="button"
            onClick={() => setWebsite("")}
            className="clear-button"
          >
            X
          </button>
        )}
        </div>
        <button type="submit">Get IP Info</button>
      </form>

      <div className="result">
        {ipAddresses.length > 0 && (
          <div>
            <h2>IP Addresses for {website}:</h2>
            <ul>
              {ipAddresses.map((ip, index) => (
                <li key={index}>{ip}</li>
              ))}
            </ul>
          </div>
        )}

        {ipInfo.length > 0 && (
          <div>
            <h2>Location and Provider Information:</h2>
            {ipInfo.map((info, index) => (
              <div key={index}>
                <h3>For IP: {ipAddresses[index]}</h3>
                <p>
                  Location: {info.city}, {info.country}
                </p>
                <p>Provider: {info.org}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
