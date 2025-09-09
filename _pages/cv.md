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
- **Dual B.S. in Electrical & Computer Engineering**, University of Kentucky — *2024, Magna Cum Laude*
## Honors & Awards 
  * NSF GRFP Fellowship 
  * University of Kentucky Dean's List: 9 semesters 
  * Lexmark International Scholarship
  * Dallas and Betty Wade Scholarship

---

# Work experience

## Research Experience
### Augmented Intelligence for Smart Manufacturing (AISM) Lab – *Graduate Research Assistant*, CWRU (2024–Present)
#### QUAN: Quaternion Approximate Networks
- Engineered Quaternion Approximate Networks, QUAN, a novel quaternion-based deep learning framework, to improve rotation-aware perception in robotic systems
- Implemented custom CUDA kernels for quaternion convolution, achieving SOTA performance for quaternion networks on oriented and classical object detection while reducing model parameters by up to 75% compared to baselines
- Researching structured optimization over the Hamilton product representations in quaternion networks to identify task-specific configurations for improved geometric learning

#### SPARK: Sequential Planning via Anchored Robotic Keypoints
- Developed Sequential Planning via Anchored Robotic Keypoints, SPARK, an interpretable planning framework for VLA models that represents tasks as symbolic "scores" of keypoint-anchored actions with explicit fallback routines
- Evaluating the complete SPARK pipeline in ROS2 with MuJoCo simulations, through a multi-modal perception stack (SAM2, DINOv2) with a finite-state sequencer and Cartesian impedance control 
 
 
### Augmented Intelligence for Smart Manufacturing (AISM) Lab – *Undergraduate Research Assistant*, University of Kentucky (2023–2024)  
- Collected and annotated industrial datasets; developed RGB-D oriented object detection model with CNNs and vision transformers
- Achieved 0.92 mAP @ IoU 0.5–0.95; integrated model into robotic arm control stack for factory simulation

## Industry Experience

### Mercor - *Software Tooling Engineer*, June 2025 - Present
- Automated weekly review workflows and lifecycle analytics, creating pipelines to track metrics across large-scale projects, integrated Snowflake and Airtable to enable teams to evaluate project health and improve data quality for LLM training pipelines
- Wrote rubrics and prompts to capture domain-specific edge cases for LLM RLHF pipelines
### HP — *Ph.D. Machine Learning Intern*, Summer 2024
- Engineered and deployed an ensemble machine learning pipeline for hierarchical cloud cost analysis on AWS (S3, EC2), integrating LSTM/ARIMA for forecasting and STL decomposition for multi-level anomaly detection
- Developed a RAG-based conversational agent for AI-enabled printer setup, benchmarking LLMs, retrieval methods, and query expansion techniques with LangChain and FAISS
- Developed an AI-driven sentiment analysis engine by applying topic modeling, clustering, and dimensionality reduction to customer call data to provide product insights to R&D teams



### Honeywell — *Embedded Systems Intern*, Summer 2023
- Developed embedded API for fire safety device firmware, improving resiliency and signal integrity  
- Designed microcontroller fallback system to prevent ASIC and EEPROM failure-induced production halts

### Lexmark — *Electrical Engineering Intern*, 2022–2023  
- Developed python flask apps for controlling test hardware for laser imaging systems  
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
- Reconstructed PET scan images from detector data by maximizing log-likelihood using sparse matrix operations and KKT conditions
- Derived and implemented Hessian gradient updates and visualized convergence

### Electrical and Computer Engineering Department - *J.A.R.V.I.S. Navigation Systems Lead*, University of Kentucky (2023)
- Designed and implemented vision and navigation systems for a telehealth robot within a full-stack, Zoom-integrated application
utilizing multithreaded architecture for autonomous and manual navigation
- Utilized SLAM, LiDAR sensors, and machine learning methods for object detection and mapping of the robot’s environment

---

# Skills

**Languages**: Assembly, Bash, C, C++, CUDA, JavaScript, MATLAB, Python, SQL

**ML & Robotics**: LangChain, MuJoCo, OpenCV, Open3D, Pybullet, Pytorch, ROS2, TensorFlow

**Cloud & DevOps**: AWS (EC2, S3), Docker, Flask, Git, REST APIs, Snowflake

**Engineering Software**: Ansys Workbench, Autodesk EAGLE, SolidWorks, Wireshark 

**Domains & Methodologies**: Anomaly Detection, Causal Inference, Computer Vision, DSP, ETL Pipelines, Generative AI, Hardware Acceleration, MLOps, NLP, Robotics, System Optimization

**Spoken languages**: English (Native), French (Fluent), Russian (Intermediate), Portuguese (Intermediate)

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

