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
    const parentWidth = container.clientWidth || container.parentElement?.clientWidth || 640;
    const parentHeight = container.clientHeight;
    const computedHeight = parentHeight && parentHeight > 0 ? parentHeight : Math.round(parentWidth * 0.6);
    return { width: parentWidth, height: computedHeight };
  }

  function showFallback(container, message) {
    if (!container) return;
    container.classList.add('photo-globe--fallback');
    container.innerHTML = `<p class="photo-globe__fallback">${message}</p>`;
  }

  function initGlobe() {
    const container = document.getElementById('photo-globe');
    if (!container || !window.PHOTOGRAPHY_DATA) return;

    if (typeof window.THREE === 'undefined' || !supportsWebGL()) {
      showFallback(container, 'The interactive globe needs WebGL (browser graphics). The full photo list is still available below.');
      return;
    }

    const THREE = window.THREE;
    const tooltip = document.getElementById('photo-globe-tooltip');
    const dims = getDimensions(container);
    container.style.minHeight = `${dims.height}px`;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(dims.width, dims.height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, dims.width / dims.height, 0.1, 100);
    camera.position.z = 3.2;

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const directional = new THREE.DirectionalLight(0xffffff, 0.6);
    directional.position.set(5, 3, 5);
    scene.add(ambient, directional);

    const globeGeometry = new THREE.SphereGeometry(1, 72, 72);
    const filmMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b3a6b,
      roughness: 0.8,
      metalness: 0.2,
      emissive: 0x050c1a,
    });
    const digitalMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffc8,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });

    const globe = new THREE.Mesh(globeGeometry, filmMaterial);
    scene.add(globe);

    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const markerMaterials = {
      film: new THREE.MeshBasicMaterial({ color: 0xfcd34d }),
      digital: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
    };

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
      const marker = new THREE.Mesh(markerGeometry.clone(), markerMaterials[type]);
      const coords = entry.coords || { lat: 0, lng: 0 };
      marker.position.copy(latLngToVector3(coords.lat, coords.lng));
      marker.userData = { ...entry, type };
      markersGroup.add(marker);
      markers[type].push(marker);
      markerMap.set(entry.slug, marker);
    }

    (window.PHOTOGRAPHY_DATA.film || []).forEach((entry) => createMarker(entry, 'film'));
    (window.PHOTOGRAPHY_DATA.digital || []).forEach((entry) => createMarker(entry, 'digital'));

    let currentMode = 'film';
    function setMode(mode) {
      currentMode = mode;
      globe.material = mode === 'film' ? filmMaterial : digitalMaterial;
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

    function onPointerDown(event) {
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
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerleave', () => {
      if (!isDragging) {
        autoRotate = 0.0015;
        if (hoveredMarker) {
          hoveredMarker.scale.set(1, 1, 1);
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
      const x = ((vector.x + 1) / 2) * rect.width + rect.left;
      const y = ((-vector.y + 1) / 2) * rect.height + rect.top;
      tooltip.style.transform = `translate(${x}px, ${y}px)`;
      tooltip.innerHTML = `<strong>${marker.userData.title}</strong><br>${marker.userData.location}`;
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
      const intersect = raycaster.intersectObjects(visibleMarkers, false)[0];
      if (intersect) {
        if (hoveredMarker && hoveredMarker !== intersect.object) {
          hoveredMarker.scale.set(1, 1, 1);
        }
        hoveredMarker = intersect.object;
        hoveredMarker.scale.set(1.6, 1.6, 1.6);
        autoRotate = 0;
        updateTooltip(hoveredMarker);
      } else if (!isDragging) {
        if (hoveredMarker) {
          hoveredMarker.scale.set(1, 1, 1);
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
      hoveredMarker && hoveredMarker.scale.set(1, 1, 1);
      hoveredMarker = marker;
      marker.scale.set(1.8, 1.8, 1.8);
      autoRotate = 0;
      updateTooltip(marker);
    }

    function resetCardHighlight(slug) {
      const marker = markerMap.get(slug);
      if (marker && marker === hoveredMarker) {
        hoveredMarker.scale.set(1, 1, 1);
        hoveredMarker = null;
        clearTooltip();
        autoRotate = 0.0015;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }
})();
