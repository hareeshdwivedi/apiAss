import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

const Form = () => {
  const [url, setUrl] = useState("");
  const [option, setOption] = useState("");
  const [message, setMessage] = useState("");
  const [remainingCalls, setRemainingCalls] = useState(3);
  const rateLimitPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
  const apiEndpoint = "/api/users/random_user"; // Replace with your actual API endpoint

  const validateURL = (inputURL) => {
    // Simple URL validation regex
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(inputURL);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateURL(url)) {
      setMessage("Invalid URL format");
      return;
    }

    if (!option) {
      setMessage("Please select an option");
      return;
    }

    if (remainingCalls <= 0) {
      setMessage(
        "Rate limit exceeded. Please wait before making more requests."
      );
      return;
    }

    try {
      const response = await axios.post(`${apiEndpoint}/${option}`, { url });

      if (response.data.success) {
        setMessage("Success");
      } else {
        setMessage("Error");
      }
    } catch (error) {
      setMessage("Error");
    } finally {
      setRemainingCalls((prevRemainingCalls) =>
        Math.max(prevRemainingCalls - 1, 0)
      );

      setTimeout(() => {
        setRemainingCalls(3);
      }, rateLimitPeriod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        URL Input:
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          pattern="https?://.+"
        />
      </label>
      <br />
      <label>
        Select an option:
        <select value={option} onChange={(e) => setOption(e.target.value)}>
          <option value="">Select an option</option>
          <option value="status">Check for a 200 Status</option>
          <option value="ssl">SSL Certificate Verification</option>
          <option value="content">Content of Robert.txt</option>
        </select>
      </label>
      <br />
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
      <p>Remaining API calls: {remainingCalls}</p>
    </form>
  );
};

export default Form;
