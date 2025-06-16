---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

---

# Education

- **Ph.D. in Electrical Engineering**, Case Western Reserve University — *Expected 2028* 
- **Dual B.S. in Electrical & Computer Engineering**, University of Kentucky — *2024, with Distinction*

---

# Work experience

## Research Experience
### Augmented Intelligence for Smart Manufacturing (AISM) Lab – *Graduate Research Assistant*, CWRU (2024–Present)
#### QUAN: Quaternion Approximate Networks
- Developed the first quaternion-based object detection framework 
- Implemented custom **forward and backward CUDA kernels** and quaternion autograd ops, achieving **SOTA performance** on COCO and DOTA with **¼ the parameters** of baseline models and comparable inference time  
- Researching structured optimization over the Hamilton product representations in quaternion networks to identify task-specific configurations for improved geometric learning

#### SPARK: Sequential Planning via Anchored Robotic Keypoints
- Designing an interpretable robot planning framework that represents manipulation tasks as symbolic “scores” of keypoint-anchored actions  
 
### Augmented Intelligence for Smart Manufacturing (AISM) Lab – *Undergraduate Research Assistant*, University of Kentucky (2023–2024)  
- Collected and annotated industrial datasets; developed RGB-D oriented object detection model with CNNs and vision transformers
- Achieved 0.92 mAP @ IoU 0.5–0.95; integrated model into robotic arm control stack for factory simulation

## Industry Experience

### HP — *Ph.D. Machine Learning Intern*, Summer 2024
- Designed ensemble forecasting system for cloud spend using LSTM, ARIMA, and STL decomposition  
- Built RAG-based conversational agent using FAISS + LangChain for intelligent printer setup guidance while evaluating the performance of various LLMs, retrieval methods, text chunking, and query expansion techniques
- Prototyped topic-aware customer support retriever system using BERT + clustering for call transcript search


### Honeywell — *Embedded Systems Intern*, Summer 2023
- Developed embedded API for fire safety device firmware, improving resiliency and signal integrity  
- Designed microcontroller fallback system to prevent ASIC and EEPROM failure-induced production halts

### Lexmark — *Electrical Engineering Intern*, 2022–2023  
- Developed python apps for controlling test hardware for laser imaging systems  
- Automated sensor alignment and improved test reliability for laser scanning subsystems  

---

# Selected Projects

### Causal PointNet - *Causality and Inference Graduate Project*, Case Western Reserve University (F. 2024)
- Integrates structural causal models into DenseFusion to correct for confounders like symmetry and viewpoint variation in 6D pose estimation
- Uses targeted interventions and backdoor adjustment

### Probabilistic Digital Twins for Robots at Scale - *Probabilistic Graph Models Graduate Project*, Case Western Reserve University (S. 2025)
- Built a ROS2-integrated Dynamic Bayesian Network using UKF to estimate UR robot friction, damping, and health over time
- Enables fault detection and evolving simulation from real-time sensor streams

### DDPMs for Robotics Survey - *Stochastic Modeling Graduate Project*, Case Western Reserve University (S. 2025)
- Implemented a NoProp-style denoising diffusion model with applications in stochastic robot control and sequential decision modeling
- Includes theoretical grounding in Markov processes and SDEs

### PET Reconstruction with Convex Optimization - *Convex Optimization Graduate Project*, Case Western Reserve University (S. 2025)
Reconstructed PET scan images from detector data by maximizing log-likelihood using sparse matrix operations and KKT conditions
- Derived and implemented Hessian gradient updates and visualized convergence

### Electrical and Computer Engineering Department - *J.A.R.V.I.S. Navigation Systems Lead*, University of Kentucky (2023)
- Designed and implemented vision and navigation systems for a telehealth robot within a full-stack, Zoom-integrated application
utilizing multithreaded architecture for autonomous and manual navigation, and seamless websocket communication
- Utilized SLAM, LiDAR sensors, and machine learning methods for object detection and mapping of the robot’s environment

---

# Skills

**Languages**: Assembly, Bash, C/C++, CUDA, MATLAB, Python

**Frameworks**: PyTorch, TensorFlow, ROS2, OpenCV, Open3D  

**Tools**: Ansys, AWS EC2/S3, Docker, Flask, FAISS, Git, LangChain, MuJoCo, SolidWorks, Wireshark

**Concepts** Causal Inference, Computer Vision, NLP, RAG, Robotics, Self-Supervised Learning

**Spoken languages**: English (Native), French (Fluent), Russian (Conversational)

---

# Publications
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
<!-- Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
   -->

<!-- Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
   -->

---

# Leadership
### MATLAB Student Ambassador – *MathWorks*, 2024–Present
  * Organized workshops, demos, and campus-wide outreach for MATLAB applications in research and industry
  * Planned and executed an ML hackathon
### Region III Finance Chair – *NSBE*, May 2023 - May 2024
  * Raised over $250,000 in sponsorships while orchestrating a career fair with 50+ orgs in attendance.

# Honors & Awards 
  * NSF GRFP Fellowship 
  * University of Kentucky Dean's List: 9 semesters 
