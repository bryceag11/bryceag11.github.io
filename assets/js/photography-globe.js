(function () {
  function supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!window.WebGLRenderingContext && !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (err) {
      return false;
    }
  }

  function getDimensions(container) {
    const parentWidth = container.clientWidth || container.parentElement?.clientWidth || 1000;
    const parentHeight = container.clientHeight;
    const computedHeight = parentHeight && parentHeight > 0 ? parentHeight : Math.round(parentWidth * 0.55); // More horizontal
    return { width: parentWidth, height: computedHeight };
  }

  function showFallback(container, message) {
    if (!container) return;
    container.classList.add('photo-globe--fallback');
    container.innerHTML = `<p class="photo-globe__fallback">${message}</p>`;
  }

  function bootGlobe() {
    const container = document.getElementById('photo-globe');
    if (!container || !window.PHOTOGRAPHY_DATA) {
      console.log('Container or PHOTOGRAPHY_DATA not found');
      return;
    }

    // Check if WebGL is supported first
    if (!supportsWebGL()) {
      showFallback(container, 'The interactive globe needs WebGL (browser graphics). The full photo list is still available below.');
      return;
    }

    // More robust Three.js loading with timeout
    const maxWaitTime = 10000; // 10 seconds max wait
    const startTime = Date.now();

    function checkAndInit() {
      if (typeof window.THREE !== 'undefined') {
        console.log('Three.js loaded successfully, initializing globe...');
        try {
          initGlobe(container);
        } catch (error) {
          console.error('Error initializing globe:', error);
          showFallback(container, 'Error initializing 3D globe. Please refresh the page.');
        }
      } else if (Date.now() - startTime < maxWaitTime) {
        // Keep trying for up to 10 seconds
        setTimeout(checkAndInit, 100);
      } else {
        console.error('Three.js failed to load after 10 seconds');
        // Try loading Three.js one more time as last resort
        if (!window.threeLoadAttempted) {
          window.threeLoadAttempted = true;
          const script = document.createElement('script');
          script.src = '/assets/js/vendor/three.min.js';
          script.onload = () => {
            if (typeof window.THREE !== 'undefined') {
              console.log('Three.js loaded via fallback');
              initGlobe(container);
            } else {
              showFallback(container, 'Unable to load 3D graphics library. Please check your connection and refresh.');
            }
          };
          script.onerror = () => {
            showFallback(container, 'Failed to load graphics support. Please refresh the page.');
          };
          document.head.appendChild(script);
        } else {
          showFallback(container, 'Loading graphics support failed. Please refresh the page.');
        }
      }
    }

    checkAndInit();
  }

  function initGlobe(container) {
    const THREE = window.THREE;
    const tooltip = document.getElementById('photo-globe-tooltip');
    const dims = getDimensions(container);
    container.style.minHeight = `${dims.height}px`;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(dims.width, dims.height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, dims.width / dims.height, 0.1, 100);
    camera.position.z = 3.2;

    // Different lighting for each mode
    const filmAmbient = new THREE.AmbientLight(0xffffff, 0.5); // Normal white light
    const filmDirectional = new THREE.DirectionalLight(0xffffff, 0.6); // White light
    filmDirectional.position.set(5, 3, 5);

    const digitalAmbient = new THREE.AmbientLight(0x6666ff, 0.6); // Brighter blue ambient
    const digitalDirectional = new THREE.DirectionalLight(0x88aaff, 0.5); // Brighter moonlight
    digitalDirectional.position.set(-5, 3, 5);

    // Create Earth globe with better geometry
    const globeGeometry = new THREE.SphereGeometry(1, 128, 64);

    // Load Earth texture from online source
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // Use a public domain Earth texture
    const earthTextureUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg';
    const earthTexture = loader.load(
      earthTextureUrl,
      () => console.log('Earth texture loaded'),
      undefined,
      () => {
        console.log('Failed to load online texture, using procedural fallback');
        // Fallback to procedural Earth
        createProceduralEarth();
      }
    );

    // Film material with real Earth texture
    const filmMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.1,
    });

    // Create day/night shader for digital mode
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D map;
      uniform vec3 sunDirection;
      uniform float time;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec4 texColor = texture2D(map, vUv);
        vec3 normal = normalize(vNormal);

        // Calculate sun angle
        float sunAngle = dot(normal, sunDirection);

        // Create smooth day/night transition
        float dayAmount = smoothstep(-0.3, 0.3, sunAngle);

        // Day colors
        vec3 dayColor = texColor.rgb;

        // Night colors (darker with city lights glow)
        vec3 nightColor = texColor.rgb * 0.1;
        nightColor += vec3(0.1, 0.08, 0.05) * (1.0 - dayAmount) * 0.5; // City lights

        // Mix day and night
        vec3 finalColor = mix(nightColor, dayColor, dayAmount);

        // Add atmosphere glow at terminator
        float terminator = 1.0 - abs(sunAngle);
        terminator = pow(terminator, 3.0);
        finalColor += vec3(1.0, 0.6, 0.2) * terminator * 0.2;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Calculate real-time sun position based on time
    function getSunDirection() {
      const now = new Date();
      const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
      const angle = (hours / 24) * Math.PI * 2 - Math.PI / 2;

      return new THREE.Vector3(
        Math.cos(angle),
        0,
        Math.sin(angle)
      );
    }

    const digitalMaterial = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: earthTexture },
        sunDirection: { value: getSunDirection() },
        time: { value: 0 }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    // Update sun position every hour for realistic day/night cycle
    setInterval(() => {
      if (digitalMaterial.uniforms) {
        digitalMaterial.uniforms.sunDirection.value = getSunDirection();
      }
    }, 3600000); // 1 hour

    // Fallback procedural Earth function
    function createProceduralEarth() {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Draw realistic ocean
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw more realistic continents
      ctx.fillStyle = '#2d5016';

      // Draw landmasses with more detail
      // North America
      ctx.beginPath();
      ctx.moveTo(300, 300);
      ctx.quadraticCurveTo(400, 250, 500, 350);
      ctx.quadraticCurveTo(450, 450, 350, 500);
      ctx.quadraticCurveTo(250, 400, 300, 300);
      ctx.fill();

      // South America
      ctx.beginPath();
      ctx.moveTo(450, 600);
      ctx.quadraticCurveTo(500, 650, 480, 800);
      ctx.quadraticCurveTo(430, 850, 400, 800);
      ctx.quadraticCurveTo(400, 700, 450, 600);
      ctx.fill();

      // Africa
      ctx.beginPath();
      ctx.moveTo(1000, 400);
      ctx.quadraticCurveTo(1100, 350, 1050, 500);
      ctx.quadraticCurveTo(1080, 700, 1000, 750);
      ctx.quadraticCurveTo(950, 650, 950, 500);
      ctx.quadraticCurveTo(980, 400, 1000, 400);
      ctx.fill();

      // Europe
      ctx.beginPath();
      ctx.moveTo(1000, 300);
      ctx.quadraticCurveTo(1100, 280, 1150, 350);
      ctx.quadraticCurveTo(1100, 380, 1000, 350);
      ctx.fill();

      // Asia
      ctx.beginPath();
      ctx.moveTo(1200, 300);
      ctx.quadraticCurveTo(1500, 250, 1600, 400);
      ctx.quadraticCurveTo(1550, 500, 1400, 450);
      ctx.quadraticCurveTo(1250, 400, 1200, 300);
      ctx.fill();

      // Australia
      ctx.beginPath();
      ctx.ellipse(1500, 750, 120, 70, 0, 0, Math.PI * 2);
      ctx.fill();

      const fallbackTexture = new THREE.CanvasTexture(canvas);
      filmMaterial.map = fallbackTexture;
      filmMaterial.needsUpdate = true;
    }

    const globe = new THREE.Mesh(globeGeometry, filmMaterial);
    scene.add(globe);

    // Add initial film lighting
    scene.add(filmAmbient, filmDirectional);

    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    // Create pin geometry (bright red ball head with silver stem)
    const markerHeadGeometry = new THREE.SphereGeometry(0.018, 16, 16);
    const markerStemGeometry = new THREE.CylinderGeometry(0.002, 0.003, 0.06, 8);

    // Materials for pins - bright red head, silver stem
    const markerHeadMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000, // Bright red
      emissive: 0xff3333,
      emissiveIntensity: 0.5, // Brighter glow
      metalness: 0.2,
      roughness: 0.3
    });

    const markerStemMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0, // Silver
      emissive: 0xffffff,
      emissiveIntensity: 0.1,
      metalness: 0.95,
      roughness: 0.05
    });

    const markerMap = new Map();
    const markers = { film: [], digital: [] };

    function latLngToVector3(lat, lng, radius = 1.01) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    function createMarker(entry, type) {
      // Create a container group for positioning
      const containerGroup = new THREE.Group();

      // Create the pin group that will be animated
      const pinGroup = new THREE.Group();

      // Create marker head (red sphere at TOP of pin)
      const markerHead = new THREE.Mesh(markerHeadGeometry.clone(), markerHeadMaterial.clone());
      markerHead.position.y = 0; // Head at origin of pin

      // Create marker stem (silver cylinder going into Earth)
      const markerStem = new THREE.Mesh(markerStemGeometry.clone(), markerStemMaterial.clone());
      markerStem.position.y = -0.03; // Half the stem height

      // Add both to the pin group
      pinGroup.add(markerHead);
      pinGroup.add(markerStem);

      // Position pin so it's mostly inserted
      pinGroup.position.y = -0.035; // Push pin down into globe (inserted position)

      // Add pin group to container
      containerGroup.add(pinGroup);

      // Position the container at the correct location on surface
      const coords = entry.coords || { lat: 0, lng: 0 };
      const position = latLngToVector3(coords.lat, coords.lng, 1.0); // On surface
      containerGroup.position.copy(position);

      // Make the container face outward from globe center
      containerGroup.lookAt(position.x * 2, position.y * 2, position.z * 2);

      // Store data including the pin group for animation
      containerGroup.userData = {
        ...entry,
        type,
        head: markerHead,
        pinGroup: pinGroup,
        defaultY: -0.035,  // Inserted position
        hoveredY: 0.01     // Pulled out position
      };

      markersGroup.add(containerGroup);
      markers[type].push(containerGroup);
      markerMap.set(entry.slug, containerGroup);
    }

    (window.PHOTOGRAPHY_DATA.film || []).forEach((entry) => createMarker(entry, 'film'));
    (window.PHOTOGRAPHY_DATA.digital || []).forEach((entry) => createMarker(entry, 'digital'));

    let currentMode = 'film';
    function setMode(mode) {
      currentMode = mode;
      globe.material = mode === 'film' ? filmMaterial : digitalMaterial;

      // Switch lighting and background based on mode
      if (mode === 'film') {
        scene.remove(digitalAmbient, digitalDirectional);
        scene.add(filmAmbient, filmDirectional);
        renderer.setClearColor(0x0a0a0a, 1.0); // Dark background

        // Apply sepia filter overlay to the whole canvas
        renderer.domElement.style.filter = 'sepia(0.8) contrast(1.2) brightness(0.9)';
      } else {
        // Digital mode - real-time day/night Earth
        scene.remove(filmAmbient, filmDirectional);
        scene.add(digitalAmbient, digitalDirectional);
        renderer.setClearColor(0x000000, 1.0); // Black space

        // No filter for digital - let the shader handle it
        renderer.domElement.style.filter = 'none';
      }

      markers.film.forEach((marker) => (marker.visible = mode === 'film'));
      markers.digital.forEach((marker) => (marker.visible = mode === 'digital'));
      container.dataset.mode = mode;
      document
        .querySelectorAll('[data-photo-mode]')
        .forEach((button) => button.classList.toggle('is-active', button.dataset.photoMode === mode));
    }

    setMode('film');

    const buttons = document.querySelectorAll('[data-photo-mode]');
    buttons.forEach((button) =>
      button.addEventListener('click', () => {
        setMode(button.dataset.photoMode);
      })
    );

    let rotationY = 0;
    let rotationX = 0;
    let autoRotate = 0.0015;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    function animate() {
      requestAnimationFrame(animate);
      if (!isDragging) {
        rotationY += autoRotate;
      }
      markersGroup.rotation.y = rotationY;
      markersGroup.rotation.x = rotationX;
      globe.rotation.y = rotationY;
      globe.rotation.x = rotationX;
      renderer.render(scene, camera);
    }

    animate();

    let clickStartTime;
    let clickStartMarker;

    function onPointerDown(event) {
      clickStartTime = Date.now();
      clickStartMarker = hoveredMarker;
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    }

    function onPointerMove(event) {
      if (isDragging) {
        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;
        rotationY += deltaX * 0.005;
        rotationX += deltaY * 0.005;
        rotationX = Math.max(Math.min(rotationX, Math.PI / 2.5), -Math.PI / 2.5);
        lastX = event.clientX;
        lastY = event.clientY;
      }
      handleHover(event);
    }

    function onPointerUp() {
      isDragging = false;

      // Check if this was a click (not a drag)
      const clickDuration = Date.now() - clickStartTime;
      if (clickDuration < 200 && clickStartMarker && clickStartMarker === hoveredMarker) {
        // Navigate to the photo album
        const slug = hoveredMarker.userData.slug;
        const type = hoveredMarker.userData.type;
        if (slug) {
          const url = `/photography/${type}/${slug}/`;
          window.location.href = url;
        }
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerleave', () => {
      if (!isDragging) {
        autoRotate = 0.0015;
        if (hoveredMarker) {
          // Animate pin back down
          if (hoveredMarker.userData.pinGroup) {
            hoveredMarker.userData.pinGroup.position.y = hoveredMarker.userData.defaultY;
          }
          if (hoveredMarker.userData.head) {
            hoveredMarker.userData.head.material.emissiveIntensity = 0.5;
          }
          hoveredMarker = null;
        }
        clearTooltip();
      }
    });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    window.addEventListener('resize', () => {
      const { width, height } = getDimensions(container);
      container.style.minHeight = `${height}px`;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMarker = null;

    function updateTooltip(marker) {
      if (!tooltip || !marker) return;
      const vector = marker.position.clone();
      vector.applyMatrix4(markersGroup.matrixWorld);
      vector.project(camera);
      const rect = renderer.domElement.getBoundingClientRect();

      // Account for scroll position
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const x = ((vector.x + 1) / 2) * rect.width + rect.left + scrollX;
      const y = ((-vector.y + 1) / 2) * rect.height + rect.top + scrollY;

      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      tooltip.style.transform = `translate(-50%, -120%)`;

      // Enhanced tooltip with photo preview
      const userData = marker.userData;
      const coverImage = userData.cover ? `<img src="${userData.cover}" alt="${userData.title}" style="width:100px;height:60px;object-fit:cover;border-radius:4px;margin-bottom:8px;">` : '';
      const cameraInfo = userData.camera ? `<small style="opacity:0.8">${userData.camera}</small><br>` : '';

      tooltip.innerHTML = `
        <div style="text-align:center;max-width:150px;">
          ${coverImage}
          <strong>${userData.title}</strong><br>
          <span style="font-size:0.9em;">${userData.location}</span><br>
          ${cameraInfo}
          <small style="opacity:0.7;font-style:italic;">Click to view album</small>
        </div>
      `;
      tooltip.style.cursor = 'pointer';
      tooltip.hidden = false;
    }

    function clearTooltip() {
      if (tooltip) {
        tooltip.hidden = true;
      }
    }

    function handleHover(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const visibleMarkers = markers[currentMode];

      // Check for intersections with pin groups (recursive to check children)
      const intersects = raycaster.intersectObjects(visibleMarkers, true);

      if (intersects.length > 0) {
        // Find the pin group that contains the intersected object
        let pinGroup = intersects[0].object;
        while (pinGroup.parent && !pinGroup.userData.type) {
          pinGroup = pinGroup.parent;
        }

        if (hoveredMarker && hoveredMarker !== pinGroup) {
          // Reset previous marker
          if (hoveredMarker.userData.pinGroup) {
            hoveredMarker.userData.pinGroup.position.y = hoveredMarker.userData.defaultY;
          }
          if (hoveredMarker.userData.head) {
            hoveredMarker.userData.head.material.emissiveIntensity = 0.5;
          }
        }

        hoveredMarker = pinGroup;

        // Animate pin pulling out
        if (hoveredMarker.userData.pinGroup) {
          hoveredMarker.userData.pinGroup.position.y = hoveredMarker.userData.hoveredY;
        }

        // Make the head glow more when hovered
        if (hoveredMarker.userData.head) {
          hoveredMarker.userData.head.material.emissiveIntensity = 0.8;
        }

        autoRotate = 0;
        updateTooltip(hoveredMarker);
      } else if (!isDragging) {
        if (hoveredMarker) {
          // Animate pin back down
          if (hoveredMarker.userData.pinGroup) {
            hoveredMarker.userData.pinGroup.position.y = hoveredMarker.userData.defaultY;
          }
          if (hoveredMarker.userData.head) {
            hoveredMarker.userData.head.material.emissiveIntensity = 0.5;
          }
          hoveredMarker = null;
        }
        autoRotate = 0.0015;
        clearTooltip();
      }
    }

    const cards = document.querySelectorAll('.photo-card');
    cards.forEach((card) => {
      const slug = card.dataset.photoMarker;
      card.addEventListener('mouseenter', () => focusMarker(slug));
      card.addEventListener('focus', () => focusMarker(slug));
      card.addEventListener('mouseleave', () => resetCardHighlight(slug));
      card.addEventListener('blur', () => resetCardHighlight(slug));
    });

    function focusMarker(slug) {
      const marker = markerMap.get(slug);
      if (!marker) return;
      if (marker.userData.type !== currentMode) {
        setMode(marker.userData.type);
      }
      rotationY = -Math.atan2(marker.position.z, marker.position.x) + Math.PI / 2;
      rotationX = Math.asin(marker.position.y / marker.position.length());

      if (hoveredMarker) {
        hoveredMarker.scale.set(1, 1, 1);
        if (hoveredMarker.userData.head) {
          hoveredMarker.userData.head.material.emissiveIntensity = 0.3;
        }
      }

      hoveredMarker = marker;
      marker.scale.set(1.8, 1.8, 1.8);
      if (marker.userData.head) {
        marker.userData.head.material.emissiveIntensity = 0.6;
      }
      autoRotate = 0;
      updateTooltip(marker);
    }

    function resetCardHighlight(slug) {
      const marker = markerMap.get(slug);
      if (marker && marker === hoveredMarker) {
        hoveredMarker.scale.set(1, 1, 1);
        if (hoveredMarker.userData.head) {
          hoveredMarker.userData.head.material.emissiveIntensity = 0.3;
        }
        hoveredMarker = null;
        clearTooltip();
        autoRotate = 0.0015;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootGlobe);
  } else {
    bootGlobe();
  }
})();
