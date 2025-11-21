---
layout: archive
title: "Older Projects"
permalink: /projects/
author_profile: false
classes: wide
---

<style>
.project-card {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  border-radius: 12px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.2);
}

.project-card h2 {
  color: white;
  margin-top: 0;
  font-size: 1.8rem;
  border-bottom: 2px solid rgba(255,255,255,0.3);
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
}

.project-card .project-meta {
  color: #b3c5ff;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.project-card p {
  color: rgba(255,255,255,0.95);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.project-card .project-image {
  margin: 1.5rem 0;
  text-align: center;
}

.project-card .project-image img {
  max-width: 400px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.project-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.project-links a {
  background: rgba(255,255,255,0.15);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s ease;
  border: 1px solid rgba(255,255,255,0.2);
}

.project-links a:hover {
  background: rgba(255,255,255,0.25);
}

.project-tech {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #b3c5ff;
  font-weight: 600;
}
</style>

<p style="text-align: center; color: #666; margin-bottom: 3rem;">Personal projects from 2023-2024</p>

<div class="project-card">
  <h2>No-Propagation Diffusion Models in Robotics</h2>
  <div class="project-meta">Machine Learning · Robotics · Stochastic Control</div>
  <div class="project-image">
    <img src="/images/no_prop_arch.png" alt="NoProp Architecture">
  </div>
  <p>Explores Denoising Diffusion Probabilistic Models using a NoProp training method. Surveys their use in robotics.</p>
  <div class="project-links">
    <a href="/files/DDPMs.pdf" target="_blank">📄 View PDF</a>
    <a href="https://github.com/bryceag11/NoProp" target="_blank">💻 View Code</a>
  </div>
</div>

<div class="project-card">
  <h2>J.A.R.V.I.S. Telehealth Robot</h2>
  <div class="project-meta">Robotics · Computer Vision · Autonomous Navigation</div>
  <div class="project-image">
    <img src="/images/500x300.png" alt="JARVIS Robot">
  </div>
  <p>Social navigating robot designed to provide an immersive telepresence experience for remote users. Led development of the robot's 3D SLAM system with servo-mounted LiDAR, path planning algorithms, and autonomous navigation capabilities. Achieved real-time mapping and dynamic obstacle avoidance in healthcare environments.</p>
  <div class="project-links">
    <a href="/files/FDR_Report.pdf" target="_blank">📄 View PDF</a>
    <a href="https://github.com/bryceag11/JARVIS.git" target="_blank">💻 View Code</a>
  </div>
</div>

<div class="project-card">
  <h2>ShopStock Embedded Cloud PCB</h2>
  <div class="project-meta">IoT · Embedded Systems · Cloud Integration</div>
  <div class="project-image">
    <img src="/images/shopstock.jpeg" alt="ShopStock Hardware">
  </div>
  <p>IoT hardware bridge for retrofitting legacy point-of-sale systems with cloud-based inventory tracking. Built custom firmware for ESP-32 microcontroller enabling real-time inventory synchronization. Co-founded ShopStock LLC and deployed system across multiple retail locations.</p>
  <div class="project-tech">Tech Stack: ESP-32 · C/C++ · Custom Firmware · Cloud Integration</div>
</div>

<div style="text-align: center; margin-top: 3rem;">
  <a href="/" style="color: #1a237e; text-decoration: none; font-weight: 500;">← Back to Home</a>
</div>
